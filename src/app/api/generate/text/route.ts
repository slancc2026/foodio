import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { prompt, locale = 'zh' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: '请输入提示内容' }, { status: 400 });
    }

    const systemPrompt = locale === 'zh'
      ? '你是一个专业的餐饮营销文案专家。根据用户需求生成高质量的宣传文案，适合在社交媒体发布。文案要简洁有力，吸引眼球。直接输出文案内容，不要加额外说明。'
      : 'You are a professional restaurant marketing copywriter. Generate high-quality promotional copy based on user needs, suitable for social media. Write concise, attention-grabbing copy. Output only the copy content without extra explanations.';

    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          input: {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
          },
          parameters: {
            result_format: 'text',
            temperature: 0.8,
            top_p: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}`, detail: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.output?.text || '';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Text generation error:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后再试' },
      { status: 500 }
    );
  }
}
