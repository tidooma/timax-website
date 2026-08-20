import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CustomSectionDTO, EditorDTO, HeroBannerDTO, OrderDTO, PortfolioItemDTO, ReviewDTO, ServiceDTO } from "@/lib/types";

const dateToString = (value: Date) => value.toISOString();

async function getActiveBanner() {
  try {
    return await prisma.heroBanner.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return null;
    }

    throw error;
  }
}

export async function getPublicData() {
  const [editors, services, reviews, banner, sections] = await Promise.all([
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
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    getActiveBanner(),
    prisma.customSection.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      include: { cards: { orderBy: { order: "asc" } } }
    })
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
    })),
    banner: banner
      ? ({
          id: banner.id,
          title: banner.title,
          description: banner.description,
          isActive: banner.isActive,
          createdAt: dateToString(banner.createdAt)
        } satisfies HeroBannerDTO)
      : null,
    sections: sections.map<CustomSectionDTO>((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      order: section.order,
      isVisible: section.isVisible,
      cards: section.cards.map((card) => ({
        id: card.id,
        title: card.title,
        subtitle: card.subtitle,
        description: card.description,
        imageUrl: card.imageUrl,
        linkUrl: card.linkUrl,
        order: card.order
      }))
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
