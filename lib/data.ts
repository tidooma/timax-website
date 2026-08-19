import { prisma } from "@/lib/prisma";
import type { EditorDTO, OrderDTO, PortfolioItemDTO, ReviewDTO, ServiceDTO } from "@/lib/types";

const dateToString = (value: Date) => value.toISOString();

export async function getPublicData() {
  const [editors, services, reviews] = await Promise.all([
    prisma.editor.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      include: {
        portfolioItems: {
          orderBy: { createdAt: "desc" }
        }
      }
    }),
    prisma.service.findMany({ orderBy: [{ isPopular: "desc" }, { createdAt: "asc" }] }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return {
    editors: editors.map<EditorDTO>((editor) => ({
      id: editor.id,
      name: editor.name,
      avatar: editor.avatar,
      description: editor.description,
      accentColor: editor.accentColor,
      isActive: editor.isActive,
      createdAt: dateToString(editor.createdAt),
      portfolioItems: editor.portfolioItems.map<PortfolioItemDTO>((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        youtubeId: item.youtubeId,
        editorId: item.editorId,
        editorName: editor.name,
        editorAccentColor: editor.accentColor,
        createdAt: dateToString(item.createdAt)
      }))
    })),
    services: services.map<ServiceDTO>((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      isPopular: service.isPopular,
      createdAt: dateToString(service.createdAt)
    })),
    reviews: reviews.map<ReviewDTO>((review) => ({
      id: review.id,
      clientName: review.clientName,
      text: review.text,
      rating: review.rating,
      createdAt: dateToString(review.createdAt)
    }))
  };
}

export function serializeOrder(order: {
  id: string;
  clientName: string;
  telegram: string;
  videoType: string;
  duration: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: Date;
}): OrderDTO {
  return {
    id: order.id,
    clientName: order.clientName,
    telegram: order.telegram,
    videoType: order.videoType,
    duration: order.duration,
    description: order.description,
    urgency: order.urgency,
    status: order.status,
    createdAt: dateToString(order.createdAt)
  };
}
