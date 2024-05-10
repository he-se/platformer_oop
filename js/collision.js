export function checkCollision(entity1, entity2) {
  // Check if entity1 and entity2 intersect using AABB collision
  return (
    entity1.x < entity2.x + entity2.width &&
    entity1.x + entity1.width > entity2.x &&
    entity1.y < entity2.y + entity2.height &&
    entity1.y + entity1.height > entity2.y
  );
}

export function handleCollisions() {
  // Check for collisions between player and enemies
  enemies.forEach((enemy) => {
    if (checkCollision(player, enemy)) {
      // Handle player-enemy collision (e.g., decrease player health)
    }
  });

  // Check for collisions between player and platforms
  platforms.forEach((platform) => {
    if (checkCollision(player, platform)) {
      // Handle player-platform collision (e.g., stop player from falling)
    }
  });

  // Check for other collisions as needed
}
