const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create ingredients
  const ingredients = await Promise.all([
    prisma.ingredient.create({ data: { name: 'wheat flour', fodmapLevel: 'high', isCommonTrigger: true, categories: '["gluten","grain"]' } }),
    prisma.ingredient.create({ data: { name: 'milk', fodmapLevel: 'medium', isCommonTrigger: true, categories: '["dairy","lactose"]' } }),
    prisma.ingredient.create({ data: { name: 'cheese', fodmapLevel: 'low', isCommonTrigger: true, categories: '["dairy"]' } }),
    prisma.ingredient.create({ data: { name: 'garlic', fodmapLevel: 'high', isCommonTrigger: true, categories: '["vegetable"]' } }),
    prisma.ingredient.create({ data: { name: 'onion', fodmapLevel: 'high', isCommonTrigger: true, categories: '["vegetable"]' } }),
    prisma.ingredient.create({ data: { name: 'chicken', fodmapLevel: 'low', isCommonTrigger: false, categories: '["protein","poultry"]' } }),
    prisma.ingredient.create({ data: { name: 'rice', fodmapLevel: 'low', isCommonTrigger: false, categories: '["grain"]' } }),
    prisma.ingredient.create({ data: { name: 'oats', fodmapLevel: 'low', isCommonTrigger: false, categories: '["grain"]' } }),
  ]);

  console.log(`✅ Created ${ingredients.length} ingredients`);

  // Create branded foods
  const nutriGrain = await prisma.brandedFood.create({
    data: {
      name: "Nutri-Grain Bar - Strawberry",
      brand: "Kellogg's",
      ingredients: {
        create: [
          { ingredientId: ingredients[0].id }, // wheat
          { ingredientId: ingredients[1].id }  // milk
        ]
      }
    }
  });

  const chobani = await prisma.brandedFood.create({
    data: {
      name: "Greek Yogurt - Plain",
      brand: "Chobani",
      ingredients: {
        create: [
          { ingredientId: ingredients[1].id }  // milk
        ]
      }
    }
  });

  console.log('✅ Created branded foods');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });