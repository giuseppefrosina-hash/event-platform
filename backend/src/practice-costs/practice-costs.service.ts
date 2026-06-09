import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PracticeCostsService {
  constructor(private prisma: PrismaService) {}

  private calculateAmounts(data: {
    quantity?: number;
    unitCost?: number;
    sellingPrice?: number | null;
  }) {
    const quantity = Number(data.quantity || 1);
    const unitCost = Number(data.unitCost || 0);
    const totalCost = quantity * unitCost;

    const sellingPrice =
      data.sellingPrice !== undefined &&
      data.sellingPrice !== null
        ? Number(data.sellingPrice)
        : null;

    const marginAmount =
      sellingPrice !== null
        ? sellingPrice - totalCost
        : null;

    const marginPercent =
      sellingPrice !== null && totalCost > 0
        ? (marginAmount! / totalCost) * 100
        : null;

    return {
      quantity,
      unitCost,
      totalCost,
      sellingPrice,
      marginAmount,
      marginPercent,
    };
  }

  create(data: {
    practiceId: string;
    category?: string;
    serviceName: string;
    supplierId?: string;
    supplierName?: string;
    quantity?: number;
    unitCost: number;
    vat?: number;
    sellingPrice?: number | null;
    status?: string;
    notes?: string;
  }) {
    const amounts = this.calculateAmounts({
      quantity: data.quantity,
      unitCost: data.unitCost,
      sellingPrice: data.sellingPrice,
    });

    return this.prisma.practiceCost.create({
      data: {
        practiceId: data.practiceId,
        category: data.category || 'Altro',
        serviceName: data.serviceName,
        supplierId: data.supplierId || null,
        supplierName: data.supplierName || null,
        quantity: amounts.quantity,
        unitCost: amounts.unitCost,
        vat: Number(data.vat ?? 22),
        totalCost: amounts.totalCost,
        sellingPrice: amounts.sellingPrice,
        marginAmount: amounts.marginAmount,
        marginPercent: amounts.marginPercent,
        status: data.status || 'draft',
        notes: data.notes || null,
      },
      include: {
        practice: true,
      },
    });
  }

  findAll() {
    return this.prisma.practiceCost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        practice: true,
      },
    });
  }

  findByPractice(practiceId: string) {
    return this.prisma.practiceCost.findMany({
      where: {
        practiceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        practice: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      category?: string;
      serviceName?: string;
      supplierId?: string | null;
      supplierName?: string | null;
      quantity?: number;
      unitCost?: number;
      vat?: number;
      sellingPrice?: number | null;
      status?: string;
      notes?: string | null;
    },
  ) {
    const current =
      await this.prisma.practiceCost.findUnique({
        where: { id },
      });

    if (!current) {
      throw new Error('Costo pratica non trovato');
    }

    const amounts = this.calculateAmounts({
      quantity:
        data.quantity !== undefined
          ? data.quantity
          : Number(current.quantity || 1),
      unitCost:
        data.unitCost !== undefined
          ? data.unitCost
          : Number(current.unitCost || 0),
      sellingPrice:
        data.sellingPrice !== undefined
          ? data.sellingPrice
          : current.sellingPrice,
    });

    return this.prisma.practiceCost.update({
      where: { id },
      data: {
        category: data.category ?? current.category,
        serviceName:
          data.serviceName ?? current.serviceName,
        supplierId:
          data.supplierId !== undefined
            ? data.supplierId || null
            : current.supplierId,
        supplierName:
          data.supplierName !== undefined
            ? data.supplierName || null
            : current.supplierName,
        quantity: amounts.quantity,
        unitCost: amounts.unitCost,
        vat:
          data.vat !== undefined
            ? Number(data.vat)
            : Number(current.vat || 22),
        totalCost: amounts.totalCost,
        sellingPrice: amounts.sellingPrice,
        marginAmount: amounts.marginAmount,
        marginPercent: amounts.marginPercent,
        status: data.status ?? current.status,
        notes:
          data.notes !== undefined
            ? data.notes || null
            : current.notes,
      },
      include: {
        practice: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.practiceCost.delete({
      where: {
        id,
      },
    });
  }
}