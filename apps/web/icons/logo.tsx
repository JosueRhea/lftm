import { cn } from "@/lib/utils";
import { SVGProps } from "react";

type Props = {} & SVGProps<SVGSVGElement>;

export function Logo({ className, ...rest }: Props) {
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...rest}
    >
      <path
        d="M11.744 2.083c-.141.05-.368.138-.504.195a1.477 1.477 0 0 1-.315.104c-.037 0-.27.09-.52.2-.248.11-.694.277-.99.372a5.778 5.778 0 0 0-.706.266c-.091.051-.449.186-.794.299-.345.113-.719.247-.83.297a1.02 1.02 0 0 1-.29.092c-.05 0-.316.102-.593.227-.277.124-.757.31-1.066.412-.633.209-1.007.348-1.383.514-.307.135-.613.247-1.225.446-.536.175-.602.243-.468.482.078.14.084.196.037.325-.03.086-.041.194-.023.24.02.047.035.503.037 1.015.002.774.015.936.08.969.128.066.631.28.899.382.139.054.53.218.867.365.339.147.707.296.82.33.113.036.447.17.743.297.296.128.676.28.845.336.936.313 1.316.455 1.64.61.196.095.427.188.51.207.147.035 1.214.468 1.64.667.114.052.298.121.41.153.113.032.228.074.257.093.109.075 1.035.395 1.144.395.063 0 .304-.08.535-.178.524-.221.523-.22 1.113-.414.267-.088.685-.246.928-.35.244-.104.462-.19.487-.19.024 0 .356-.121.736-.27.38-.148.733-.27.783-.27a.49.49 0 0 0 .205-.072c.146-.091 1.113-.47 1.2-.47.036 0 .366-.124.735-.274a43.74 43.74 0 0 1 1.407-.54c.406-.147.854-.322.995-.39.14-.07.316-.125.39-.125.084 0 .198-.061.302-.161l.168-.161.032-1.279c.041-1.652.044-1.638-.352-1.75a8.818 8.818 0 0 1-.563-.182 81.543 81.543 0 0 0-.922-.332 9.318 9.318 0 0 1-.717-.272 2.326 2.326 0 0 0-.333-.133c-.473-.16-1.61-.609-1.675-.66-.034-.027-.333-.133-.666-.236a13.495 13.495 0 0 1-.963-.337c-.694-.291-1.54-.61-1.862-.7a4.463 4.463 0 0 1-.586-.218c-.144-.069-.303-.125-.353-.125-.05 0-.265-.067-.478-.148-.451-.172-.436-.17-.768-.053Zm1.009 1.672c.346.133.745.278.885.323.14.046.278.101.307.124.07.055.97.395 1.046.395.034 0 .158.048.277.107.118.058.388.166.6.24.21.072.579.213.817.311.239.098.453.179.478.179.12 0 1.112.418 1.097.463-.01.028-.234.136-.498.239a5.27 5.27 0 0 0-.534.23c-.03.023-.234.1-.454.17-.22.071-.462.172-.538.224-.076.053-.265.13-.42.174-.155.043-.35.102-.435.13l-.586.2c-.238.08-.515.186-.615.235-.101.05-.535.225-.964.39-.429.164-.848.332-.932.373-.211.105-.274.098-.769-.094-.24-.093-.645-.24-.898-.325-.254-.086-.54-.2-.637-.253a6.419 6.419 0 0 0-.614-.26c-.242-.09-.693-.267-1.003-.393-.772-.315-1.511-.6-1.665-.644-.208-.059-.862-.362-.896-.416-.018-.027.021-.07.086-.095.065-.025.323-.124.573-.222.25-.097.55-.19.665-.208a2.18 2.18 0 0 0 .494-.164c.155-.074.512-.217.794-.318.282-.101.587-.215.679-.253.643-.267.777-.315.882-.315a.693.693 0 0 0 .24-.073c.08-.04.342-.143.581-.23.24-.086.62-.23.845-.319.504-.2.37-.209 1.112.075Z"
        fill="inherit"
      />
      <path
        d="M2.155 11.155c-.023.034-.045 1.534-.048 3.334L2.1 17.762l.122.184c.074.11.178.196.263.216.077.018.25.085.382.149.133.064.28.116.325.116.046 0 .145.041.22.093.075.051.332.163.571.249.24.086.666.253.948.373.281.119.892.363 1.357.543.465.18.872.348.904.373.032.024.24.108.46.186.222.078.531.196.688.262.156.067.375.15.486.183.305.094.86.324 1.83.76.22.098.546.232.726.297.18.065.386.155.456.199.16.101.426.06.678-.104a.715.715 0 0 1 .297-.117c.065 0 .255-.064.421-.143.166-.078.533-.231.815-.34.282-.107.639-.251.794-.32.155-.068.397-.167.538-.221.14-.054.452-.18.691-.279.24-.1.666-.27.948-.379.282-.108.582-.236.666-.285.084-.048.269-.126.41-.173.14-.047.325-.114.41-.149.527-.217 1.228-.501 1.536-.622.197-.077.497-.205.666-.284.17-.08.48-.206.692-.28.453-.16.48-.18.547-.438.079-.296.049-4.943-.032-5.089-.047-.085-.049-.144-.005-.245.032-.074.062-.388.068-.697l.011-.564-.302.01a1.492 1.492 0 0 0-.564.13c-.319.147-.983.408-1.158.455-.07.019-.208.076-.306.126a.966.966 0 0 1-.223.092c-.054 0-1.665.607-1.955.736-.113.051-.309.118-.435.15a5.346 5.346 0 0 0-.615.224c-.211.09-.603.245-.87.344-.268.098-.591.229-.718.29a9.775 9.775 0 0 1-1.253.48c-.253.08-.59.21-.748.287a5.698 5.698 0 0 1-.608.244l-.319.103-.168-.1a.735.735 0 0 0-.234-.1c-.036 0-.252-.077-.48-.17l-.98-.398c-.31-.126-.667-.263-.794-.304-.126-.04-.564-.213-.973-.383-.409-.17-.823-.326-.922-.345a1.756 1.756 0 0 1-.359-.123c-.273-.134-2.406-.981-2.849-1.132a7.706 7.706 0 0 1-.538-.212 6.527 6.527 0 0 0-.634-.231 3.58 3.58 0 0 1-.528-.202c-.199-.11-.246-.115-.301-.032Z"
        fill="inherit"
      />
    </svg>
  );
}
