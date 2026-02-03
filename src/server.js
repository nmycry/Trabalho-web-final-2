const app = require('./app');
const prisma = require('./config/database');

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Testar conexao com o banco
    await prisma.$connect();
    console.log('Conectado ao banco de dados com sucesso!');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nEncerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nEncerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

main();
