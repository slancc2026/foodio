import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = 'sk-99fb538eec714e688edb8693618c5a5d';
const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com/api/v1';

const CATEGORY_STYLES: Record<string, string> = {
  light: 'Fresh healthy food photo style, bright green and white tones, appetizing lighting',
  hotpot: 'Steaming hot food photography style, warm red and orange tones, rich colors, atmospheric lighting',
  chinese: 'Chinese cuisine food photo style, bright colors, sizzling appearance, warm lighting',
  fry: 'Golden crispy food photo style, warm amber tones, crunchy appearance',
  milk: 'Cafe drink photo style, pastel pink and white tones, refreshing look',
  bread: 'Bakery food photo style, warm golden tones, freshly baked appearance',
};

async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const mimeType = file.type || 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

async function submitImageTask(referenceImageBase64: string, stylePrompt: string): Promise<string> {
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
          {
            role: 'user',
            content: [
              { image: referenceImageBase64, text: `Generate a professional food photo based on the reference dish image. Style: ${stylePrompt}. Keep the dish identity (same type of food), enhance appearance professionally.` },
            ],
          },
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

  throw new Error('Generation timed out');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const category = formData.get('category') as string;

    if (!file) return NextResponse.json({ error: '请上传菜品照片' }, { status: 400 });
    if (!category || !CATEGORY_STYLES[category]) return NextResponse.json({ error: '请选择有效品类' }, { status: 400 });

    const stylePrompt = CATEGORY_STYLES[category];

    // 把上传的图片转成base64
    const imageBase64 = await fileToBase64(file);

    const taskId = await submitImageTask(imageBase64, stylePrompt);
    const imageUrl = await pollTaskResult(taskId);

    // 下载生成结果图
    const imageResp = await fetch(imageUrl);
    const buffer = await imageResp.arrayBuffer();
    const resultBase64 = Buffer.from(buffer).toString('base64');

    const sizes = [
      { platform: 'meituan', size: '1:1', desc: '美团·1:1头图' },
      { platform: 'xiaohongshu', size: '3:4', desc: '小红书·3:4种草' },
      { platform: 'douyin', size: '9:16', desc: '抖音·9:16封面' },
      { platform: 'moments', size: '1:1', desc: '朋友圈·1:1分享' },
    ];

    const images = sizes.map((s) => ({
      platform: s.platform,
      size: s.size,
      desc: s.desc,
      url: imageUrl,
      base64: `data:image/png;base64,${resultBase64}`,
    }));

    return NextResponse.json({ success: true, category: category, images });
  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: error?.message || '生成失败' }, { status: 500 });
  }
}
