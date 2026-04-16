import { PrismaClient } from '@prisma/client';
import { SCANNER_DOMAINS } from '../src/lib/scannerDomains';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < SCANNER_DOMAINS.length; i++) {
    const d = SCANNER_DOMAINS[i];
    await prisma.complianceDomain.upsert({
      where: { id: d.id },
      create: { id: d.id, label: d.label, sortOrder: i },
      update: { label: d.label, sortOrder: i },
    });

    await prisma.complianceAct.deleteMany({ where: { domainId: d.id } });

    for (let j = 0; j < d.compliances.length; j++) {
      await prisma.complianceAct.create({
        data: {
          domainId: d.id,
          title: d.compliances[j],
          sortOrder: j,
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
