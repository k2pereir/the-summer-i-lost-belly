// backend/server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ============ USER ENDPOINTS ============
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, name, age, weight, gender, dietType } = req.body;
    
    const user = await prisma.user.create({
      data: {
        email,
        password, // In production, hash this!
        name,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        gender,
        dietType
      }
    });
    
    res.json({ success: true, userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.userId) },
      include: {
        allergies: true,
        healthConditions: true,
        menstrualCycle: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  try {
    const { name, age, weight, gender, dietType } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.userId) },
      data: {
        name,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        gender,
        dietType
      }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ ALLERGY ENDPOINTS ============
app.post('/api/allergies', async (req, res) => {
  try {
    const { userId, allergen, severity } = req.body;
    const allergy = await prisma.allergy.create({
      data: {
        userId: parseInt(userId),
        allergen,
        severity
      }
    });
    res.json(allergy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ MEAL ENDPOINTS ============
app.post('/api/meals/branded', async (req, res) => {
  try {
    const { userId, brandedFoodId, mealType, portionSize, mealTime } = req.body;
    
    const meal = await prisma.meal.create({
      data: {
        userId: parseInt(userId),
        brandedFoodId: parseInt(brandedFoodId),
        mealType,
        portionSize,
        mealTime: new Date(mealTime),
        isBranded: true
      },
      include: {
        brandedFood: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        }
      }
    });
    
    res.json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/meals/homemade', async (req, res) => {
  try {
    const { userId, mealName, mealType, ingredients, portionSize, mealTime } = req.body;
    
    const meal = await prisma.meal.create({
      data: {
        userId: parseInt(userId),
        mealName,
        mealType,
        portionSize,
        mealTime: new Date(mealTime),
        isBranded: false,
        ingredients: {
          create: ingredients.map(ing => ({
            ingredientId: ing.ingredientId,
            amount: ing.amount
          }))
        }
      },
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });
    
    res.json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/meals/:userId', async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: {
        brandedFood: {
          include: {
            ingredients: {
              include: { ingredient: true }
            }
          }
        },
        ingredients: {
          include: { ingredient: true }
        }
      },
      orderBy: { mealTime: 'desc' }
    });
    res.json(meals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ SYMPTOM ENDPOINTS ============
app.post('/api/symptoms', async (req, res) => {
  try {
    const { userId, bloatingSeverity, symptomTime, otherSymptoms, mood, energyLevel, notes } = req.body;
    
    const symptom = await prisma.symptom.create({
      data: {
        userId: parseInt(userId),
        symptomTime: new Date(symptomTime),
        bloatingSeverity: parseInt(bloatingSeverity),
        otherSymptoms: otherSymptoms ? JSON.stringify(otherSymptoms) : null,
        mood,
        energyLevel: energyLevel ? parseInt(energyLevel) : null,
        notes
      }
    });
    
    res.json(symptom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/symptoms/:userId', async (req, res) => {
  try {
    const symptoms = await prisma.symptom.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { symptomTime: 'desc' }
    });
    res.json(symptoms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ FOOD SEARCH ENDPOINTS ============
app.get('/api/foods/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    const foods = await prisma.brandedFood.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        ingredients: {
          include: { ingredient: true }
        }
      },
      take: 10
    });
    
    res.json(foods);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/ingredients/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    const ingredients = await prisma.ingredient.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 10
    });
    
    res.json(ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ ANALYTICS ENDPOINT ============
app.get('/api/analytics/triggers/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Get all meals and symptoms
    const meals = await prisma.meal.findMany({
      where: { userId },
      include: {
        brandedFood: {
          include: {
            ingredients: { include: { ingredient: true } }
          }
        },
        ingredients: { include: { ingredient: true } }
      }
    });
    
    const symptoms = await prisma.symptom.findMany({
      where: { userId }
    });
    
    // Simple correlation analysis
    const ingredientCounts = {};
    const highBloatingDays = symptoms
      .filter(s => s.bloatingSeverity >= 7)
      .map(s => s.symptomTime.toISOString().split('T')[0]);
    
    meals.forEach(meal => {
      const mealDate = meal.mealTime.toISOString().split('T')[0];
      const isHighBloatingDay = highBloatingDays.includes(mealDate);
      
      // Get all ingredients from this meal
      let allIngredients = [];
      if (meal.isBranded && meal.brandedFood) {
        allIngredients = meal.brandedFood.ingredients.map(fi => fi.ingredient);
      } else {
        allIngredients = meal.ingredients.map(mi => mi.ingredient);
      }
      
      allIngredients.forEach(ing => {
        if (!ingredientCounts[ing.name]) {
          ingredientCounts[ing.name] = {
            totalCount: 0,
            highBloatingCount: 0,
            ingredient: ing
          };
        }
        ingredientCounts[ing.name].totalCount++;
        if (isHighBloatingDay) {
          ingredientCounts[ing.name].highBloatingCount++;
        }
      });
    });
    
    // Calculate trigger scores
    const triggers = Object.values(ingredientCounts)
      .map(data => ({
        ingredient: data.ingredient.name,
        fodmapLevel: data.ingredient.fodmapLevel,
        frequency: data.totalCount > 0 ? data.highBloatingCount / data.totalCount : 0,
        confidence: data.totalCount >= 5 ? 'high' : 'low',
        totalOccurrences: data.totalCount,
        highBloatingOccurrences: data.highBloatingCount
      }))
      .filter(t => t.frequency > 0.6 && t.totalOccurrences >= 3)
      .sort((a, b) => b.frequency - a.frequency);
    
    res.json({ triggers, totalMeals: meals.length, totalSymptoms: symptoms.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});