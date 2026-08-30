import type { Icon, IconProps as PhosphorProps } from "@phosphor-icons/react";
import {
  ArrowsOut,
  At,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChatTeardropText,
  Compass,
  DotsNine,
  DotsThree,
  DownloadSimple,
  FileDoc,
  FilePdf,
  FilePpt,
  FileXls,
  Funnel,
  Info,
  MagnifyingGlass,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Microphone,
  NotePencil,
  Paperclip,
  PaperPlaneTilt,
  PencilSimple,
  Phone,
  Play,
  Plus,
  PushPin,
  ShareNetwork,
  Shield,
  SidebarSimple,
  Smiley,
  Sparkle,
  Tag,
  TextT,
  UserPlus,
  Users,
  VideoCamera,
  X,
} from "@phosphor-icons/react";

type Props = {
  className?: string;
  size?: number;
};

function ph(IconCmp: Icon, defaultSize = 20, extra?: Partial<PhosphorProps>) {
  return function LineIcon({ size = defaultSize, className }: Props) {
    return <IconCmp size={size} className={className} weight="regular" {...extra} />;
  };
}

export const IconApps = ph(DotsNine, 20, { weight: "bold" });
export const IconPanelLeft = ph(SidebarSimple);
export const IconPanelRight = ph(SidebarSimple, 20, { mirrored: true });
export const IconChevronLeft = ph(CaretLeft, 18);
export const IconChevronRight = ph(CaretRight, 18);
export const IconChevronDown = ph(CaretDown, 16);
export const IconSearch = ph(MagnifyingGlass);
export const IconZoomIn = ph(MagnifyingGlassPlus);
export const IconZoomOut = ph(MagnifyingGlassMinus);
export const IconDownload = ph(DownloadSimple);
export const IconMore = ph(DotsThree);
export const IconCompose = ph(NotePencil);
export const IconMention = ph(At);
export const IconTag = ph(Tag);
export const IconCompass = ph(Compass);
export const IconDrafts = ph(ChatTeardropText);
export const IconPin = ph(PushPin, 16);
export const IconEdit = ph(PencilSimple, 16);
export const IconCall = ph(Phone);
export const IconVideo = ph(VideoCamera);
export const IconPersonAdd = ph(UserPlus);
export const IconPeople = ph(Users);
export const IconAdd = ph(Plus);
export const IconFilter = ph(Funnel, 16);
export const IconFormat = ph(TextT);
export const IconEmoji = ph(Smiley);
export const IconAttach = ph(Paperclip);
export const IconSend = ph(PaperPlaneTilt);
export const IconSparkle = ph(Sparkle);
export const IconMic = ph(Microphone);
export const IconShield = ph(Shield);
export const IconExpand = ph(ArrowsOut);
export const IconInfo = ph(Info, 16);
export const IconDismiss = ph(X, 16);
export const IconPlay = ph(Play);
export const IconShare = ph(ShareNetwork, 16);
export const IconFilePpt = ph(FilePpt);
export const IconFileDoc = ph(FileDoc);
export const IconFileXls = ph(FileXls);
export const IconFilePdf = ph(FilePdf);
