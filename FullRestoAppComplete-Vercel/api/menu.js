module.exports = (req, res) => {
  const menu = [
    { id: 1, name: "Ayam Bakar", description: "Ayam bakar madu", price: 30000 },
    { id: 2, name: "Sate Ayam", description: "Sate dengan bumbu kacang", price: 25000 },
    { id: 3, name: "Nasi Uduk", description: "Nasi uduk lengkap dengan telur dan sambal", price: 20000 }
  ];
  res.status(200).json(menu);
};
