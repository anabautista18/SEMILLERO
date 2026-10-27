const image = (name) => `/images/${encodeURIComponent(name)}`;

export const members = [
  { name: "Andrés Camilo Medina (Coord.)" },
  { name: "Wilson Sebastián Martínez" },
  { name: "Nicolle Galvis Guzmán" },
  { name: "Valentina Beca" },
  {
    name: "Alejandro Ortegón",
    imageFront: image("Alejandro Ortegon.jpg"),
    imageBack: image("Alejandro Ortegon2.jpg"),
  },
  { name: "Carlos Rangel" },
  {
    name: "María Fernanda Giraldo",
    imageFront: image("MARIAFERNANDAGIRALDO.jpg"),
    imageBack: image("MARIAFERNANDAGIRALDO2.jpg"),
  },
  { name: "Brayan Zamora" },
  {
    name: "Delio Palacios",
    imageFront: image("Delio Palacios.jpg"),
    imageBack: image("Delio Palacios2.jpg"),
  },
  { name: "Juan José Sánchez" },
  {
    name: "Katherine Mora",
    imageFront: image("Katherine Mora.jpg"),
    imageBack: image("Katherine Mora2.jpg"),
  },
  {
    name: "Miguel Agudelo",
    imageFront: image("Miguel_Agudelo.jpg"),
    imageBack: image("Miguel_Agudelo2.jpg"),
  },
  {
    name: "Ana María Bautista",
    imageFront: image("ANABAUTISTA.jpg"),
    imageBack: image("ANABAUTISTA2.jpg"),
  },
  {
    name: "Felipe Rodríguez",
    imageFront: image("Felipe Rodriguez.jpg"),
    imageBack: image("FELIPERODRIGUEZ2.jpg"),
  },
  {
    name: "Estefanía Martínez",
    imageFront: image("Estefanía Martínez.jpg"),
    imageBack: image("Estefanía Martínez2.jpg"),
  },
  {
    name: "María José Gutiérrez",
    imageFront: image("María_José_Gutierrez.jpg"),
    imageBack: image("Maria_Jose_Gutierrez2.jpg"),
  },
  {
    name: "Foto grupal",
    imageFront: image("fotogrupal.jpg"),
    type: "group",
  },
];
