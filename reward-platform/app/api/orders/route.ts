import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productType, targetUrl, keyword, targetQuantity, memo } = body;

    if (!userId || !productType || !targetUrl || !keyword || !targetQuantity) {
      return NextResponse.json({ error: '필수 입력 항목이 누락되었습니다.' }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        productType,
        targetUrl,
        keyword,
        targetQuantity: Number(targetQuantity),
        memo,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '오더 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  try {
    const orders = await prisma.order.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: '오더 목록 조회 실패' }, { status: 500 });
  }
}
