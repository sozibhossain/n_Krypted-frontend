import Image from "next/image";

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export function ProcessStep({
  number,
  title,
  description,
  icon,
  color,
}: ProcessStepProps) {
  return (
    <div className="p-5 rounded-lg" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-start">
        <Image src={icon} alt="work 1" height={70} width={60} />

        <Image src={number} alt="work 1" height={144} width={138} />
      </div>

      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-4">
      {description}
      </p>
    </div>
  );
}
