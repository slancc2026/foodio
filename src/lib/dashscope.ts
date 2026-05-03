const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com/api/v1/services/aigc';

interface DashScopeResponse {
  output: {
    text?: string;
    task_status?: string;
    results?: Array<{ url: string }>;
  };
}

/**
 * 调用通义千问生成文案
 */
export async function generateText(prompt: string, locale: string = 'zh'): Promise<string> {
  const systemPrompt = locale === 'zh'
    ? '你是一个专业的餐饮营销文案专家。根据用户需求生成高质量的宣传文案，适合在社交媒体发布。文案要简洁有力，吸引眼球。直接输出文案内容，不要加额外说明。'
    : 'You are a professional restaurant marketing copywriter. Generate high-quality promotional copy based on user needs, suitable for social media. Write concise, attention-grabbing copy. Output only the copy content without extra explanations.';

  const response = await fetch(`${DASHSCOPE_BASE}/text-generation/generation`, {
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
  });

  if (!response.ok) {
    throw new Error(`DashScope API error: ${response.status} ${response.statusText}`);
  }

  const data: DashScopeResponse = await response.json();
  return data.output.text || '';
}

/**
 * 调用通义万相生成图片
 */
export async function generateImage(prompt: string, size: string = '1024*1024'): Promise<string[]> {
  const response = await fetch(`${DASHSCOPE_BASE}/text2image/image-synthesis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'wanx-image',
      input: {
        prompt: prompt,
      },
      parameters: {
        size: size,
        n: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`DashScope Image API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (data.output?.results) {
    return data.output.results.map((r: { url: string }) => r.url);
  }
  return [];
}
