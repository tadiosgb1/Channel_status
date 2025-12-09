<template>
  <aside class="w-64 bg-white border-r h-screen fixed">
    <div class="p-6">
      <h1 class="text-xl font-bold">Dashboard</h1>
    </div>
    <nav class="mt-6">
      <ul>
        <li>
          <RouterLink
            :to="{ name: 'check-status' }"
            class="flex items-center p-4 hover:bg-secondary hover:text-white"
            :class="{ 'bg-primary text-white font-semibold': isActive('check-status') }"
          >
            Check Status
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'cases' }"
            class="flex items-center p-4 hover:bg-secondary hover:text-white"
            :class="{ 'bg-primary text-white font-semibold': isActive('cases') }"
          >
            Cases
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'create-users' }"
            class="flex items-center p-4 hover:bg-secondary hover:text-white"
            :class="{ 'bg-primary text-white font-semibold': isActive('create-users') }"
          >
            Create Users
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  name: 'Sidebar',
  setup() {
    const route = useRoute();

    const isActive = (name) => route.name === name;

    return { isActive };
  },
};
</script>

<style scoped>
nav ul li a {
  transition: all 0.2s ease-in-out;
}
</style>
module.exports = (sequelize, Sequelize) => {
  const Case = sequelize.define("Case", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    case_type: { type: Sequelize.STRING },
    case_title: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: "users", key: "id" }
    }
  }, {
    tableName: "cases"
  });

  Case.associate = (db) => {
    Case.belongsTo(db.User, { foreignKey: "user_id" });
  };

  return Case;
};
