import express from "express";

const router = express.Router();

router.post("/register", async (request, response) => {
  response.send("register")
})
router.post("/login", async (request, response) => {
  response.send("login")
})

export default router;