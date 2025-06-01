declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.mp4";

declare module '*.svg' {
  import { type SvgProps } from 'react-native-svg';

  const content: React.StatelessComponent<SvgProps>;
  export default content;

}