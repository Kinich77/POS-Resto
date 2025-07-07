import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const menu = [
    {
      name: "Nasi Gudeg Special",
      description: "Gudeg ayam dengan nasi, sambal, dan kerupuk",
      price: 25000,
      image: "gudeg.jpg",
    },
    {
      name: "Nasi Goreng Kampung",
      description: "Nasi goreng dengan telur, sayuran, dan kerupuk",
      price: 22000,
      image: "nasgor.jpg",
    },
  ];
  res.status(200).json(menu);
}
