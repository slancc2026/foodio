import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = 'sk-99fb538eec714e688edb8693618c5a5d';
const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com/api/v1';

const CATEGORY_PROMPTS: Record<string, { en: string; cn: string }> = {
  light: { cn: '轻食沙拉', en: 'A healthy light meal salad dish, fresh green vegetables, grilled chicken breast, cherry tomatoes, on a wooden table, natural lighting, clean composition, bright green and white tones, food photography style, realistic, appetizing, shallow depth of field' },
  hotpot: { cn: '火锅烧烤', en: 'A steaming hot pot dish, boiling broth with meat slices, mushrooms, vegetables, warm red and orange tones, dim sum restaurant lighting, steam rising, rich colors, close-up shot, food photography, realistic, appetizing, dark wooden background' },
  chinese: { cn: '中餐炒菜', en: 'A Chinese stir-fry dish, colorful vegetables and meat, wok hei aroma, warm lighting, ceramic plate, realistic food photography, appetizing, shallow depth of field, bright fresh colors' },
  fry: { cn: '炸鸡小吃', en: 'Crispy fried chicken pieces, golden brown exterior, on a rustic plate, warm amber tones, food photography, realistic, crunchy texture visible, shallow depth of field, appetizing' },
  milk: { cn: '奶茶饮品', en: 'Milk tea or bubble tea drink in a clear glass, tapioca pearls visible, creamy layers, ice cubes, pastel pink and white tones, cafe lighting, refreshing look, food photography, realistic' },
  bread: { cn: '烘焙甜点', en: 'Freshly baked pastries or desserts, golden crust, dusted with powdered sugar, warm amber lighting, rustic wooden surface, bakery style, realistic food photography, appetizing, shallow depth of field' },
};

async function submitImageTask(prompt: string): Promise<string> {
  const resp = await fetch(`${DASHSCOPE_BASE}/services/aigc/image-generation/generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      'X-DashScope-Async': 'enable',
    },
    body: JSON.stringify({
      model: 'wan2.7-image',
      input: { prompt },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`DashScope submit error (${resp.status}): ${errText}`);
  }

  const data = await resp.json();
  const taskId = data.output?.task_id;
  if (!taskId) throw new Error('No task_id: ' + JSON.stringify(data));

  return taskId;
}

async function pollTaskResult(taskId: string): Promise<string> {
  const queryUrl = `${DASHSCOPE_BASE}/tasks/${taskId}`;

  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const resp = await fetch(queryUrl, {
        headers: { 'Authorization': `Bearer ${DASHSCOPE_API_KEY}` },
      });

      if (!resp.ok) continue;

      const data = await resp.json();
      const status = data.output?.task_status;
      const results = data.output?.results;

      if (status === 'SUCCEEDED' && results?.[0]?.url) {
        return results[0].url;
      } else if (status === 'FAILED') {
        throw new Error(`Generation failed: ${data.output?.message || 'unknown'}`);
      }
    } catch (e) {
      if (i >= 89) throw e;
    }
  }

  throw new Error('Generation timed out after 3 minutes');
}

async function downloadImageAsBase64(url: string): Promise<string> {
  const resp = await fetch(url);
  const buffer = await resp.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:image/png;base64,${base64}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const category = formData.get('category') as string;

    if (!file) return NextResponse.json({ error: '请上传菜品照片' }, { status: 400 });
    if (!category || !CATEGORY_PROMPTS[category]) return NextResponse.json({ error: '请选择有效品类' }, { status: 400 });

    const catPrompt = CATEGORY_PROMPTS[category];
    const prompt = `${catPrompt.en}. The dish should maintain its original food characteristics, realistic photography style.`;

    const sizes = [
      { platform: 'meituan', size: '1:1', desc: '美团·1:1头图' },
      { platform: 'xiaohongshu', size: '3:4', desc: '小红书·3:4种草' },
      { platform: 'douyin', size: '9:16', desc: '抖音·9:16封面' },
      { platform: 'moments', size: '1:1', desc: '朋友圈·1:1分享' },
    ];

    const images: any[] = [];
    for (const s of sizes) {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        const taskId = await submitImageTask(prompt);
        const imageUrl = await pollTaskResult(taskId);
        const base64 = await downloadImageAsBase64(imageUrl);
        images.push({ platform: s.platform, size: s.size, desc: s.desc, url: imageUrl, base64 });
      } catch (err: any) {
        images.push({ platform: s.platform, size: s.size, desc: s.desc, url: null, base64: null, error: err.message || '生成失败' });
      }
    }

    return NextResponse.json({ success: true, category: catPrompt.cn, images });
  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: error?.message || '生成失败' }, { status: 500 });
  }
}
