import { ImagePropertiesAnnotation, Color } from "queries";

interface ColorRowProps {
  index: number;
  color: Color;
  pixelFraction: number;
}

const ColorRow: React.FC<ColorRowProps> = ({ index, color, pixelFraction }) => {
  const colorString = `${color.red},${color.green},${color.blue}`;
  const brightness =
    (color.red * 299 + color.green * 587 + color.blue * 114) / 1000;
  const maxBrightness = 200; // set max brightness for border color
  const borderColorString =
    brightness > maxBrightness ? "#BBBBBB" : `rgba(${colorString}, 0.8)`;

  return (
    <td className="text-right h-12 border p-4 border-neutral-300">
      <div className="flex justify-between">
        <span className="text-xs font-semibold">
          {`RGB = (${color.red}, ${color.green}, ${color.blue})`}
        </span>
        <span className="text-xs font-medium">
          {index === 0 ? "Pixel fraction = " : null}
          {(pixelFraction * 100).toFixed(0)}%
        </span>
      </div>
      <div
        className={"w-full h-5 bg-opacity-40 bg-neutral-300"}
        style={{ border: `1px solid ${borderColorString}` }} // Add a border
      >
        <div
          className={"h-full"}
          style={{
            backgroundColor: `rgb(${colorString})`,
            width: `${pixelFraction * 100}%`,
          }}
        />
      </div>
    </td>
  );
};

interface ImagePropertiesTableProps {
  annotation: ImagePropertiesAnnotation;
}

const ImagePropertiesTable: React.FC<ImagePropertiesTableProps> = ({
  annotation,
}) => {
  return (
    <div>
      <table className="w-full">
        <tbody>
          {annotation.dominantColors.colors
            .sort((a, b) => b.pixelFraction - a.pixelFraction)
            .map(({ color, score, pixelFraction }, index) => (
              <tr key={index}>
                <ColorRow
                  index={index}
                  color={color}
                  pixelFraction={pixelFraction}
                />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImagePropertiesTable;
