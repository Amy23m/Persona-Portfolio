import type { ComponentType } from "react";
import type { AppId } from "@/components/types";
import { AboutIcon, ExperienceIcon, ProjectsIcon, ConnectIcon, MusicIcon } from "@/components/icons/AppIcons";
import AboutWindow from "@/components/windows/AboutWindow";
import ExperienceWindow from "@/components/windows/ExperienceWindow";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import ConnectWindow from "@/components/windows/ConnectWindow";
import MusicWindow from "@/components/windows/MusicWindow";

export type AppDefinition = {
  id: AppId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType;
  defaultSize: { width: number; height: number };
};

export const APPS: AppDefinition[] = [
  {
    id: "about",
    label: "readme.txt",
    icon: AboutIcon,
    component: AboutWindow,
    defaultSize: { width: 760, height: 640 },
  },
  {
    id: "experience",
    label: "My Experience",
    icon: ExperienceIcon,
    component: ExperienceWindow,
    defaultSize: { width: 820, height: 660 },
  },
  {
    id: "projects",
    label: "builds",
    icon: ProjectsIcon,
    component: ProjectsWindow,
    defaultSize: { width: 880, height: 600 },
  },
  {
    id: "connect",
    label: "ping_me",
    icon: ConnectIcon,
    component: ConnectWindow,
    defaultSize: { width: 520, height: 420 },
  },
  {
    id: "music",
    label: "clouddisc.mp3",
    icon: MusicIcon,
    component: MusicWindow,
    defaultSize: { width: 860, height: 600 },
  },
];

export const APP_MAP: Record<AppId, AppDefinition> = APPS.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<AppId, AppDefinition>
);
