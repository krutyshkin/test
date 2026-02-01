module.exports = (req, res) => {
  const { name = "world" } = req.query;
  const secretHint = process.env.SECRET_MESSAGE
    ? "Environment secret is configured."
    : "Environment secret is missing.";

  res.status(200).json({
    message: `Hello, ${name}!`,
    secretHint,
  });
};
