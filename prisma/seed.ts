import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@cesizen.fr" },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("Admin1234!", 10);
    await prisma.user.create({
      data: {
        email: "admin@cesizen.fr",
        password: hashedPassword,
        role: "admin",
        state: 1,
      },
    });
    console.log("Admin créé : admin@cesizen.fr");
  } else {
    console.log("Admin déjà existant, seed ignoré");
  }

  const admin = await prisma.user.findUnique({ where: { email: "admin@cesizen.fr" } });
  if (!admin) return;

  const articleCount = await prisma.article.count();
  if (articleCount === 0) {
    const articles = [
      {
        title: "5 techniques de respiration pour réduire le stress",
        content: "Le stress quotidien peut être maîtrisé grâce à des exercices de respiration simples. La respiration abdominale, la cohérence cardiaque ou encore la respiration 4-7-8 sont des méthodes accessibles à tous. Pratiquez-les quelques minutes par jour pour ressentir des effets durables sur votre bien-être.",
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSecYK3wIuA-Hkb1rW_xY2NrW-sOXWuvyuLJw&s",
        status: 1,
        readingTime: 4,
      },
      {
        title: "Les bienfaits de la méditation sur la santé mentale",
        content: "La méditation de pleine conscience est reconnue pour ses effets positifs sur l'anxiété, la dépression et la qualité du sommeil. Des études montrent qu'une pratique régulière de 10 minutes par jour suffit à observer des changements significatifs dans la gestion des émotions.",
        imgUrl: "https://www.oceans7ashwem.com/images/yoga.jpg",
        status: 1,
        readingTime: 5,
      },
      {
        title: "L'importance du sommeil pour le bien-être",
        content: "Un sommeil de qualité est essentiel pour la récupération physique et mentale. Adoptez une routine de coucher régulière, évitez les écrans une heure avant de dormir et maintenez une température fraîche dans votre chambre pour favoriser un sommeil réparateur.",
        imgUrl: "https://purexpert.fr/wp-content/uploads/2024/01/une-femme-dans-un-sommeil-profond.webp",
        status: 1,
        readingTime: 6,
      },
      {
        title: "Yoga : une pratique complète pour le corps et l'esprit",
        content: "Le yoga combine postures physiques, exercices de respiration et méditation. Cette discipline millénaire améliore la souplesse, renforce les muscles et apaise le mental. Accessible à tous les niveaux, il se pratique chez soi ou en cours collectifs.",
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwrJBurHxbO7RuuVkj1OpPHwZv6EnruVg8Fg&s",
        status: 1,
        readingTime: 5,
      },
      {
        title: "Alimentation et santé mentale : quel lien ?",
        content: "Ce que nous mangeons influence directement notre humeur et notre énergie. Les oméga-3, les vitamines B et le magnésium jouent un rôle clé dans le fonctionnement du cerveau. Privilégiez les aliments complets, les fruits et les légumes pour soutenir votre équilibre émotionnel.",
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZZei9DRpme7qKWnqUiaa62Lw6L2Mhzjx-AA&s",
        status: 1,
        readingTime: 7,
      },
      {
        title: "La marche en pleine nature : un remède simple contre l'anxiété",
        content: "Marcher en forêt ou dans un parc réduit le cortisol, l'hormone du stress. Le contact avec la nature stimule la production de sérotonine et améliore la concentration. Une promenade de 30 minutes suffit pour ressentir un apaisement notable.",
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsRNOg3NTmsHqtkTCFI9D5gHQHeBDluxAPQ&s",
        status: 1,
        readingTime: 4,
      },
      {
        title: "Gérer ses émotions grâce à la cohérence cardiaque",
        content: "La cohérence cardiaque est une technique de respiration rythmée qui synchronise le cœur et le cerveau. En inspirant 5 secondes puis en expirant 5 secondes pendant 5 minutes, vous activez le système nerveux parasympathique et retrouvez un état de calme profond.",
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3X4WcEDEp2LEC2zeIM_O939jFmEFh05aLqQ&s",
        status: 1,
        readingTime: 3,
      },
      {
        title: "Les écrans et le stress : comment se déconnecter",
        content: "L'exposition prolongée aux écrans augmente la fatigue visuelle et mentale. Instaurez des pauses régulières, activez le mode nuit le soir et définissez des plages horaires sans téléphone pour préserver votre équilibre nerveux.",
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW3uOrww9N3EBttg8eQSohqH9JNLN7Pff7GQ&s",
        status: 1,
        readingTime: 5,
      },
      {
        title: "L'art de la gratitude pour améliorer son quotidien",
        content: "Tenir un journal de gratitude aide à recentrer son attention sur les aspects positifs de la vie. Chaque soir, notez trois choses pour lesquelles vous êtes reconnaissant. Cette habitude simple renforce l'optimisme et diminue les ruminations négatives.",
        imgUrl: "https://positive.b-cdn.net/wp-content/uploads/gratitude-1-e1654845999596.jpg",
        status: 1,
        readingTime: 3,
      },
      {
        title: "Étirements matinaux : bien commencer la journée",
        content: "Quelques minutes d'étirements au réveil suffisent pour réveiller le corps en douceur. Étirez le dos, les épaules et les jambes pour améliorer la circulation sanguine, relâcher les tensions nocturnes et aborder la journée avec énergie.",
        imgUrl: "https://www.opaortho.com/wp-content/uploads/2024/08/stretching-exercises-for-flexibility.png",
        status: 1,
        readingTime: 4,
      },
    ];

    for (const article of articles) {
      await prisma.article.create({
        data: { ...article, authorId: admin.id },
      });
    }
    console.log("10 articles créés");
  } else {
    console.log("Articles déjà existants, seed ignoré");
  }

  const exerciseCount = await prisma.breathingExercise.count();
  if (exerciseCount === 0) {
    const exercises = [
      {
        name: "Respiration 7-4-8",
        description: "Technique de relaxation profonde. Inspirez pendant 7 secondes, maintenez l'apnée pendant 4 secondes, puis expirez lentement pendant 8 secondes. Idéale pour favoriser l'endormissement et réduire l'anxiété.",
        duration: 300,
        level: 2,
        steps: [7, 4, 8],
        benefits: "Réduit l'anxiété, favorise l'endormissement, calme le système nerveux",
      },
      {
        name: "Respiration 5-5",
        description: "Respiration équilibrée sans apnée. Inspirez pendant 5 secondes puis expirez pendant 5 secondes. Simple et efficace pour retrouver son calme rapidement.",
        duration: 180,
        level: 1,
        steps: [5, 0, 5],
        benefits: "Réduit le stress, facile à pratiquer, accessible aux débutants",
      },
      {
        name: "Respiration 4-6",
        description: "Respiration apaisante avec une expiration plus longue que l'inspiration. Inspirez pendant 4 secondes puis expirez pendant 6 secondes. L'expiration prolongée active le système nerveux parasympathique.",
        duration: 180,
        level: 1,
        steps: [4, 0, 6],
        benefits: "Active le système parasympathique, apaise le rythme cardiaque",
      },
    ];

    for (const exercise of exercises) {
      await prisma.breathingExercise.create({
        data: exercise,
      });
    }
    console.log("3 exercices de respiration créés");
  } else {
    console.log("Exercices déjà existants, seed ignoré");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());