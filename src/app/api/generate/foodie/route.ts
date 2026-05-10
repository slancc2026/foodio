import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = 'sk-99fb538eec714e688edb8693618c5a5d';
const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com/api/v1';

const CATEGORY_PROMPTS: Record<string, string> = {
  light: 'A healthy light meal salad dish, fresh green vegetables, grilled chicken breast, cherry tomatoes, on a wooden table, natural lighting, clean composition, bright green and white tones, food photography style, realistic, appetizing, shallow depth of field',
  hotpot: 'A steaming hot pot dish, boiling broth with meat slices, mushrooms, vegetables, warm red and orange tones, dim sum restaurant lighting, steam rising, rich colors, close-up shot, food photography, realistic, appetizing, dark wooden background',
  chinese: 'A Chinese stir-fry dish, colorful vegetables and meat, wok hei aroma, warm lighting, ceramic plate, realistic food photography, appetizing, shallow depth of field, bright fresh colors',
  fry: 'Crispy fried chicken pieces, golden brown exterior, on a rustic plate, warm amber tones, food photography, realistic, crunchy texture visible, shallow depth of field, appetizing',
  milk: 'Milk tea or bubble tea drink in a clear glass, tapioca pearls visible, creamy layers, ice cubes, pastel pink and white tones, cafe lighting, refreshing look, food photography, realistic',
  bread: 'Freshly baked pastries or desserts, golden crust, dusted with powdered sugar, warm amber lighting, rustic wooden surface, bakery style, realistic food photography, appetizing, shallow depth of field',
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
      input: {
        messages: [
          { role: 'user', content: [{ text: prompt }] },
        ],
      },
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

      if (status === 'SUCCEEDED') {
        const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;
        if (imageUrl) return imageUrl;
        throw new Error('No image URL in SUCCEEDED response');
      } else if (status === 'FAILED') {
        throw new Error(`Generation failed: ${data.output?.message || data.output?.code || 'unknown'}`);
      }
    } catch (e) {
      if (i >= 89) throw e;
    }
  }

  throw new Error('Generation timed out after 3 minutes');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const category = formData.get('category') as string;

    if (!file) return NextResponse.json({ error: '请上传菜品照片' }, { status: 400 });
    if (!category || !CATEGORY_PROMPTS[category]) return NextResponse.json({ error: '请选择有效品类' }, { status: 400 });

    const prompt = `Generate a restaurant food photo: ${CATEGORY_PROMPTS[category]}`;

    const taskId = await submitImageTask(prompt);
    const imageUrl = await pollTaskResult(taskId);

    // 下载图片做base64返回给前端
    const imageResp = await fetch(imageUrl);
    const buffer = await imageResp.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    const sizes = [
      { platform: 'meituan', size: '1:1', desc: '美团·1:1头图' },
      { platform: 'xiaohongshu', size: '3:4', desc: '小红书·3:4种草' },
      { platform: 'douyin', size: '9:16', desc: '抖音·9:16封面' },
      { platform: 'moments', size: '1:1', desc: '朋友圈·1:1分享' },
    ];

    // 首版先用一张图展示4个平台，后续再优化为每平台独立生成
    const images = sizes.map((s) => ({
      platform: s.platform,
      size: s.size,
      desc: s.desc,
      url: imageUrl,
      base64: `data:image/png;base64,${base64}`,
    }));

    return NextResponse.json({ success: true, category: category, images });
  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: error?.message || '生成失败' }, { status: 500 });
  }
}
