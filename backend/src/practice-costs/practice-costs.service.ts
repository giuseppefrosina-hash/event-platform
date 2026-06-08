import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PracticeCostsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    practiceId: string;
    serviceName: string;
    supplierId?: string;
    supplierName?: string;
    quantity?: number;
    unitCost: number;
    vat?: number;
    notes?: string;
  }) {
    const quantity = Number(data.quantity || 1);
    const unitCost = Number(data.unitCost || 0);
    const vat = Number(data.vat ?? 22);
    const totalCost = quantity * unitCost;

    return this.prisma.practiceCost.create({
      data: {
        practiceId: data.practiceId,
        serviceName: data.serviceName,
        supplierId: data.supplierId || null,
        supplierName: data.supplierName || null,
        quantity,
        unitCost,
        vat,
        totalCost,
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

  update(
    id: string,
    data: {
      serviceName?: string;
      supplierId?: string | null;
      supplierName?: string | null;
      quantity?: number;
      unitCost?: number;
      vat?: number;
      notes?: string | null;
    },
  ) {
    return this.prisma.practiceCost
      .findUnique({
        where: { id },
      })
      .then((current) => {
        if (!current) {
          throw new Error('Costo pratica non trovato');
        }

        const quantity =
          data.quantity !== undefined
            ? Number(data.quantity)
            : Number(current.quantity || 1);

        const unitCost =
          data.unitCost !== undefined
            ? Number(data.unitCost)
            : Number(current.unitCost || 0);

        const vat =
          data.vat !== undefined
            ? Number(data.vat)
            : Number(current.vat || 22);

        const totalCost = quantity * unitCost;

        return this.prisma.practiceCost.update({
          where: { id },
          data: {
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
            quantity,
            unitCost,
            vat,
            totalCost,
            notes:
              data.notes !== undefined
                ? data.notes || null
                : current.notes,
          },
          include: {
            practice: true,
          },
        });
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