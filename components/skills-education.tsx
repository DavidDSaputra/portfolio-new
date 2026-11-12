import type { CSSProperties } from "react";
import { education, skills, tintVar } from "@/lib/content";
import { cn } from "@/lib/cn";
import FigLabel from "@/components/ui/fig-label";
import Marquee from "@/components/ui/marquee";
import { Reveal, RevealTitle } from "@/components/ui/reveal";

const pad = (value: number) => String(value).padStart(2, "0");

/* Playful tilt for some chips; straightens on hover. */
const chipTilt = (index: number) =>
  index % 4 === 1 ? "-rotate-2" : index % 5 === 3 ? "rotate-2" : "rotate-0";

/* Staggered column offsets on wide screens. */
const groupOffset = ["xl:mt-0", "xl:mt-14", "xl:mt-4", "xl:mt-20"];

/* Education sticker layout: one tall card + two stacked, each slightly tilted. */
const eduLayout = [
  { cell: "lg:col-span-7 lg:row-span-2", tilt: "sm:-rotate-1" },
  { cell: "lg:col-span-5 lg:mt-16", tilt: "sm:rotate-[1.25deg]" },
  { cell: "lg:col-span-5 lg:-ml-10 lg:mr-10", tilt: "sm:-rotate-[1.5deg]" },
];

function SkillGroups() {
  return (
    <ul className="mt-12 grid items-start gap-5 sm:grid-cols-2 lg:mt-16 xl:grid-cols-[1.35fr_1fr_1.1fr_0.9fr]">
      {skills.groups.map((group, groupIndex) => (
        <Reveal
          as="li"
          key={group.title}
          delay={groupIndex * 0.08}
          className={groupOffset[groupIndex % groupOffset.length]}
        >
          <article
            className="card group/card h-full overflow-hidden transition-[transform,box-shadow] duration-700 ease-out-expo hover:-translate-y-1 hover:shadow-lift"
            style={{ "--tint": tintVar(group.tint) } as CSSProperties}
          >
            <header className="flex items-end justify-between gap-4 bg-(--tint) px-6 pt-5 pb-4">
              <h3 className="display text-[clamp(1.75rem,2.4vw,2.25rem)]">{group.title}</h3>
              <span aria-hidden="true" className="label-mono shrink-0 pb-1 tabular-nums">
                {pad(groupIndex + 1)}
                <span className="text-ink-soft">/{pad(group.items.length)}</span>
              </span>
            </header>
            <ul className="flex flex-wrap gap-2 px-5 pt-5 pb-6">
              {group.items.map((item, itemIndex) => (
                <li
                  key={item}
                  className={cn(
                    "rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm font-medium",
                    "transition-[transform,background-color,border-color,box-shadow] duration-500 ease-out-expo",
                    "hover:-translate-y-1 hover:rotate-0 hover:border-ink/15 hover:bg-(--tint) hover:shadow-soft",
                    chipTilt(itemIndex),
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

function EducationCards() {
  return (
    <ul className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
      {education.items.map((item, index) => {
        const layout = eduLayout[index % eduLayout.length];
        return (
          <Reveal as="li" key={item.school} delay={index * 0.1} className={layout.cell}>
            <article
              className={cn(
                "relative h-full rounded-[2rem] border border-ink/10 p-6 shadow-soft sm:p-8 lg:p-10",
                "transition-[transform,box-shadow] duration-700 ease-out-expo",
                "hover:-translate-y-1 hover:rotate-0 hover:shadow-lift",
                layout.tilt,
              )}
              style={{ backgroundColor: tintVar(item.tint) }}
            >
              {/* Tape strip */}
              <span
                aria-hidden="true"
                className="absolute -top-3 left-10 h-6 w-20 -rotate-3 rounded-sm border border-ink/5 bg-card/70 shadow-soft"
              />
              <div className="flex items-start justify-between gap-6">
                <p className="label-mono max-w-[34rem] text-ink">{item.meta}</p>
                <span
                  aria-hidden="true"
                  className="label-mono grid size-9 shrink-0 place-items-center rounded-full bg-card tabular-nums shadow-soft"
                >
                  {pad(index + 1)}
                </span>
              </div>
              <h3
                className={cn(
                  "display mt-6",
                  index === 0
                    ? "text-[clamp(2rem,4.6vw,4.25rem)]"
                    : "text-[clamp(1.75rem,3vw,2.75rem)]",
                )}
              >
                {item.school}
              </h3>
              <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6 text-[0.95rem] leading-relaxed">
                {item.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2">
                    <span aria-hidden="true" className="mt-[0.6em] size-1.5 rounded-full bg-ink" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        );
      })}
    </ul>
  );
}

export default function SkillsEducation() {
  return (
    <>
      <section id="skills" className="overflow-x-clip pt-[clamp(5rem,11vw,10rem)]">
        <div className="shell">
          <Reveal>
            <FigLabel fig={skills.fig} label={skills.figLabel} />
          </Reveal>
          <RevealTitle
            lines={skills.heading}
            className="display mt-6 text-[clamp(3rem,11.5vw,10rem)]"
          />
          <SkillGroups />
        </div>

        <Marquee
          items={skills.marquee}
          reverse
          duration={48}
          className={cn(
            "mt-16 border-y border-line py-5 lg:mt-24 lg:py-7",
            "[&_li:nth-child(even)>span:first-child]:text-transparent",
            "[&_li:nth-child(even)>span:first-child]:[-webkit-text-stroke:1.5px_var(--color-ink)]",
          )}
          itemClassName="display text-[clamp(2.75rem,8vw,7rem)]"
          separatorClassName="text-[clamp(1.5rem,4vw,3.5rem)]"
        />
      </section>

      <section id="education" className="overflow-x-clip py-[clamp(5rem,11vw,10rem)]">
        <div className="shell">
          <Reveal>
            <FigLabel fig={education.fig} label={education.figLabel} />
          </Reveal>
          <RevealTitle
            lines={education.heading}
            className="display mt-6 text-[clamp(2.4rem,10vw,9rem)]"
          />
          <EducationCards />
        </div>
      </section>
    </>
  );
}
