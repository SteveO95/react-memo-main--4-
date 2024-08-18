const Icon = ({ iconName, width = 15, height = 15 }) => {
  const iconPath = require(`../../assets/icons/${iconName}.svg`);

  return <img src={iconPath} alt={iconName} width={width} height={height} />;
};

export default Icon;
