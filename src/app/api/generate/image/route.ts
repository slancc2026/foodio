import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024*1024' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: '请输入图片描述' }, { status: 400 });
    }

    const enhancedPrompt = `美食摄影，菜品特写，专业灯光，诱人呈现：${prompt}`;

    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'wanx-image',
          input: {
            prompt: enhancedPrompt,
          },
          parameters: {
            size: size,
            n: 1,
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

    // 通义万相返回异步任务，需要轮询获取结果
    if (data.output?.task_id) {
      const taskId = data.output.task_id;

      // 轮询最多 30 秒
      for (let i = 0; i < 30; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const statusResponse = await fetch(
          `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
            },
          }
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();

          if (statusData.output?.task_status === 'SUCCEEDED') {
            const imageUrl = statusData.output?.results?.[0]?.url;
            if (imageUrl) {
              return NextResponse.json({ imageUrl });
            }
          } else if (statusData.output?.task_status === 'FAILED') {
            return NextResponse.json(
              { error: '图片生成失败' },
              { status: 500 }
            );
          }
        }
      }

      return NextResponse.json(
        { error: '图片生成超时' },
        { status: 408 }
      );
    }

    // 同步返回
    if (data.output?.results) {
      return NextResponse.json({
        imageUrl: data.output.results[0]?.url,
      });
    }

    return NextResponse.json(
      { error: '未知响应格式', data },
      { status: 500 }
    );
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后再试' },
      { status: 500 }
    );
  }
}
