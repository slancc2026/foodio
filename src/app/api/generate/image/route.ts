import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: '点数不足', credits: 0 },
        { status: 402 }
      );
    }

    const { prompt, size = '1024*1024' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: '请输入图片描述' }, { status: 400 });
    }

    const enhancedPrompt = `美食摄影，菜品特写，专业灯光，诱人呈现：${prompt}`;

    // Step 1: Submit async task
    const submitResponse = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
          'X-DashScope-Async': 'enable',
        },
        body: JSON.stringify({
          model: 'wanx-v1',
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

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      return NextResponse.json(
        { error: `提交失败: ${submitResponse.status}`, detail: errorText },
        { status: submitResponse.status }
      );
    }

    const submitData = await submitResponse.json();
    const taskId = submitData.output?.task_id;

    if (!taskId) {
      return NextResponse.json({ error: '未获取到任务ID' }, { status: 500 });
    }

    // Step 2: Poll for result (up to 60s)
    for (let i = 0; i < 60; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
          },
        }
      );

      if (!statusResponse.ok) continue;

      const statusData = await statusResponse.json();
      const taskStatus = statusData.output?.task_status;

      if (taskStatus === 'SUCCEEDED') {
        const results = statusData.output?.results;
        if (results && results.length > 0) {
          // 通义万相返回的图片URL有时效性，转成base64或使用原URL
          const imageUrl = results[0].url;

          await prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: 1 } },
          });

          await prisma.generation.create({
            data: {
              userId: user.id,
              type: 'image',
              prompt,
              result: imageUrl,
              creditsUsed: 1,
            },
          });

          return NextResponse.json({ imageUrl, credits: user.credits - 1 });
        }
      } else if (taskStatus === 'FAILED') {
        return NextResponse.json(
          { error: '图片生成失败' },
          { status: 500 }
        );
      }
      // PENDING / RUNNING 继续轮询
    }

    return NextResponse.json(
      { error: '图片生成超时，请稍后重试' },
      { status: 408 }
    );
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后再试' },
      { status: 500 }
    );
  }
}
