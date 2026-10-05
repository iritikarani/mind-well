export type AnimalKey = "fox" | "panda" | "cat" | "dog" | "rabbit" | "deer";

export interface AnimalDef {
  key: AnimalKey;
  label: string;
  primary: string;
  accent: string;
  ears: "pointy" | "round" | "tallPointy" | "floppy" | "long" | "antler";
}

export const ANIMALS: AnimalDef[] = [
  { key: "fox", label: "Fox", primary: "#F3A24B", accent: "#FFF7EA", ears: "pointy" },
  { key: "panda", label: "Panda", primary: "#3A3A3A", accent: "#FFFFFF", ears: "round" },
  { key: "cat", label: "Cat", primary: "#6E6670", accent: "#FFFFFF", ears: "tallPointy" },
  { key: "dog", label: "Dog", primary: "#E0B26B", accent: "#FFFFFF", ears: "floppy" },
  { key: "rabbit", label: "Rabbit", primary: "#D9C7EE", accent: "#FFF7FB", ears: "long" },
  { key: "deer", label: "Deer", primary: "#E4D4BE", accent: "#FFFFFF", ears: "antler" },
];

export function animalByKey(key: AnimalKey) {
  return ANIMALS.find((a) => a.key === key)!;
}
