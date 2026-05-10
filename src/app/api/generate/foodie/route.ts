import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = 'sk-99fb538eec714e688edb8693618c5a5d';
const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com/api/v1';

// 品类Prompt模板
const CATEGORY_PROMPTS: Record<string, { en: string; cn: string }> = {
  light: {
    cn: '轻食沙拉',
    en: 'A healthy light meal salad dish, fresh green vegetables, grilled chicken breast, cherry tomatoes, on a wooden table, natural lighting, clean composition, bright green and white tones, food photography style, realistic, appetizing, shallow depth of field',
  },
  hotpot: {
    cn: '火锅烧烤',
    en: 'A steaming hot pot dish, boiling broth with meat slices, mushrooms, vegetables, warm red and orange tones, dim sum restaurant lighting, steam rising, rich colors, close-up shot, food photography, realistic, appetizing, dark wooden background',
  },
  chinese: {
    cn: '中餐炒菜',
    en: 'A Chinese stir-fry dish, colorful vegetables and meat, wok hei aroma, warm lighting, ceramic plate, realistic food photography, appetizing, shallow depth of field, bright fresh colors',
  },
  fry: {
    cn: '炸鸡小吃',
    en: 'Crispy fried chicken pieces, golden brown exterior, on a rustic plate, warm amber tones, food photography, realistic, crunchy texture visible, shallow depth of field, appetizing',
  },
  milk: {
    cn: '奶茶饮品',
    en: 'Milk tea or bubble tea drink in a clear glass, tapioca pearls visible, creamy layers, ice cubes, pastel pink and white tones, cafe lighting, refreshing look, food photography, realistic',
  },
  bread: {
    cn: '烘焙甜点',
    en: 'Freshly baked pastries or desserts, golden crust, dusted with powdered sugar, warm amber lighting, rustic wooden surface, bakery style, realistic food photography, appetizing, shallow depth of field',
  },
};

async function callWanxImage(prompt: string, size: string = '1024*1024'): Promise<string> {
  const resp = await fetch(`${DASHSCOPE_BASE}/services/aigc/text2image/image-synthesis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'wanx2.1-t2i-turbo',
      input: {
        prompt,
      },
      parameters: {
        size,
        n: 1,
      },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`DashScope API error (${resp.status}): ${errText}`);
  }

  const data = await resp.json();

  // 通义万相返回结构：data.output.task_id -> 轮询获取结果
  const taskId = data.output?.task_id;
  if (!taskId) {
    throw new Error('No task_id in response: ' + JSON.stringify(data));
  }

  // 轮询直到生成完成
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000));

    const queryResp = await fetch(
      `${DASHSCOPE_BASE}/services/aigc/text2image/image-synthesis/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        },
      }
    );

    if (!queryResp.ok) continue;

    const queryData = await queryResp.json();
    const status = queryData.output?.task_status;

    if (status === 'SUCCEEDED') {
      const results = queryData.output?.results;
      if (results?.[0]?.url) {
        return results[0].url;
      }
      throw new Error('No image URL in successful response');
    } else if (status === 'FAILED') {
      throw new Error(`Image generation failed: ${queryData.output?.message || 'unknown'}`);
    }
    // else 'RUNNING' or 'PENDING' - keep polling
  }

  throw new Error('Image generation timed out');
}

async function downloadImageAsBase64(url: string): Promise<string> {
  const resp = await fetch(url);
  const buffer = await resp.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const contentType = resp.headers.get('content-type') || 'image/png';
  return `data:${contentType};base64,${base64}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json({ error: '请上传菜品照片' }, { status: 400 });
    }
    if (!category || !CATEGORY_PROMPTS[category]) {
      return NextResponse.json({ error: '请选择有效品类' }, { status: 400 });
    }

    const catPrompt = CATEGORY_PROMPTS[category];
    const prompt = `${catPrompt.en}. The dish should maintain its original food characteristics, realistic photography style.`;

    // 生成4个平台的图片（不同尺寸）
    const sizes = [
      { platform: 'meituan', size: '1024*1024', desc: '美团·1:1头图' },
      { platform: 'xiaohongshu', size: '768*1024', desc: '小红书·3:4种草' },
      { platform: 'douyin', size: '576*1024', desc: '抖音·9:16封面' },
      { platform: 'moments', size: '1024*1024', desc: '朋友圈·1:1分享' },
    ];

    // 并行生成（实际可优化为队列，首版直接并发）
    const results = await Promise.allSettled(
      sizes.map(async (s) => {
        const imageUrl = await callWanxImage(prompt, s.size);
        const base64 = await downloadImageAsBase64(imageUrl);
        return {
          platform: s.platform,
          size: s.size,
          desc: s.desc,
          url: imageUrl,
          base64,
        };
      })
    );

    const images = results.map((r, i) => {
      if (r.status === 'fulfilled') {
        return r.value;
      }
      return {
        platform: sizes[i].platform,
        size: sizes[i].size,
        desc: sizes[i].desc,
        url: null,
        base64: null,
        error: r.reason?.message || '生成失败',
      };
    });

    return NextResponse.json({
      success: true,
      category: catPrompt.cn,
      images,
    });
  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error?.message || '生成失败' },
      { status: 500 }
    );
  }
}
