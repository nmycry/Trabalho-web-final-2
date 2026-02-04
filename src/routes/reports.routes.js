import { Router } from "express";

const router = Router();

/**
 * Rota reservada para geração de relatórios estatísticos.
 * Funcionalidade planejada para versões futuras do sistema.
 * 
 * Esta rota não está integrada ao app principal.
 */
router.get("/reports/summary", (req, res) => {
  return res.status(501).json({
    message: "Funcionalidade de relatórios ainda não implementada"
  });
});

export default router;