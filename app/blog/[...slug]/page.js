// app/blog/[...slug]/page.js
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/navbar";
import NoPageFound from "../../not-found";
import BlogProps from "../../props/blog-props";

/* ---------------- Utils ---------------- */
function lastSegment(path = "") {
  try {
    return path.split("/").filter(Boolean).pop()?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

/* ---------- Optional fallback headings if no <SectionTitle> tags exist ---------- */
const KNOWN_HEADINGS = [
  "History of UI & UX",
  "Definition of UX and UI Design",
  "Goals and Objectives of UX and UI Design",
  "UX Design",
  "UI Design",
  "UX vs. UI Design",
  "UX Designer vs UI Designer: What Are They Responsible For?",
  "What Are UX Designers Responsible For?",
  "What Are UI Designers Responsible For?",
  "Career Prospects and Salary",
  "Skills Evolution and Specialization",
  "The Role Research Plays in Both UX & UI Design Processes",
  "UX Research",
  "UI Research",
  "UX & UI Work Hand-In-Hand",
  "Importance of UX/UI Design",
  "Real-World Examples of UX/UI Design",
  "Emerging Trends and Future Directions",
  "Next Generation Interaction Models",
  "Ethical Design Considerations",
  "FAQ",
  "Conclusion",
];

/* ---------- Build sections: prefer <SectionTitle> tags; else fallback ---------- */
function buildSections(info) {
  if (!info?.trim()) return [];
  const normalized = info.replace(/\r\n/g, "\n");

  // Case-insensitive, spacing-tolerant, supports your typo <SectionTItle/>
  // Matches: <SectionTitle> Title Here <SectionTitle/> (or ...<SectionTItle/>)
  const TAG_RE = /<\s*SectionTitle\s*>\s*([^<]+?)\s*<\s*SectionT(?:itle|Itle)\s*\/\s*>/gi;

  const tagMatches = [];
  let m;
  while ((m = TAG_RE.exec(normalized))) {
    tagMatches.push({
      title: (m[1] || "").trim(),
      start: m.index,
      after: TAG_RE.lastIndex,
    });
  }

  if (tagMatches.length) {
    const sections = [];

    const preface = normalized.slice(0, tagMatches[0].start).trim();
    if (preface) sections.push({ id: "overview", title: "Overview", body: preface });

    for (let i = 0; i < tagMatches.length; i++) {
      const { title, after } = tagMatches[i];
      const nextStart = i < tagMatches.length - 1 ? tagMatches[i + 1].start : normalized.length;
      const body = normalized.slice(after, nextStart).trim();

      const id =
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-") || `section-${i}`;

      sections.push({ id, title, body });
    }

    return sections;
  }

  // ---------- Fallback: known heading parsing ----------
  const indices = [];
  KNOWN_HEADINGS.forEach((h) => {
    const re = new RegExp(`^${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "m");
    const match = re.exec(normalized);
    if (match?.index !== undefined) indices.push({ title: h, index: match.index });
  });

  if (indices.length === 0) {
    return [{ id: "top", title: "Overview", body: normalized }];
  }

  indices.sort((a, b) => a.index - b.index);
  const sections = [];

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index;
    const end = i < indices.length - 1 ? indices[i + 1].index : normalized.length;
    const chunk = normalized.slice(start, end).trim();

    const nl = chunk.indexOf("\n");
    const title = nl > -1 ? chunk.slice(0, nl).trim() : chunk;
    const body = nl > -1 ? chunk.slice(nl + 1).trim() : "";

    const id =
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || `section-${i}`;

    sections.push({ id, title, body });
  }

  const pre = normalized.slice(0, indices[0].index).trim();
  if (pre) sections.unshift({ id: "overview", title: "Overview", body: pre });

  return sections;
}

function Paragraphs({ text }) {
  const parts = useMemo(
    () => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    [text]
  );
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className="leading-7">
          {p}
        </p>
      ))}
    </>
  );
}

export default function BlogPage({ params }) {
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "";
  const slug = String(rawSlug).toLowerCase();

  // Non-hook logic is fine to gate
  const blogMatch = BlogProps.find((item) => lastSegment(item.page) === slug) || null;
  const hasBlog = !!blogMatch;

  // --- All hooks at top-level, never conditional ---
  const sections = useMemo(() => {
    if (!hasBlog) return [];
    return buildSections(String(blogMatch.info || ""));
  }, [hasBlog, blogMatch?.info]);

  const related = useMemo(() => {
    if (!hasBlog) return [];
    return BlogProps.filter((b) => lastSegment(b.page) !== slug).slice(0, 6);
  }, [hasBlog, slug]);

  const observerRef = useRef(null);
  const activeIdRef = useRef("");

  const handleJump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96; // adjust for navbar
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    if (!hasBlog || sections.length === 0) return;

    const sectionEls = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!sectionEls.length) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id && visible.target.id !== activeIdRef.current) {
          activeIdRef.current = visible.target.id;
          window.history.replaceState(null, "", `#${visible.target.id}`);
          document
            .querySelectorAll("[data-timeline-link]")
            .forEach((n) => n.classList.remove("text-black"));
          const activeLink = document.querySelector(
            `[data-timeline-link="${visible.target.id}"]`
          );
          activeLink?.classList.add("text-black");
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.2, 0.35, 0.5] }
    );

    sectionEls.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [hasBlog, sections]);

  useEffect(() => {
    if (!hasBlog) return;
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y });
  }, [hasBlog]);

  // Render paths are conditional, but hooks above always ran
  if (!hasBlog) {
    return <NoPageFound slug={slug} />;
  }

  return (
    <div className="bg-white text-black min-h-screen flex flex-col gap-9">
      <Navbar />

      {/* Header */}
      <div className="dynamic-padding max-w-[798px] flex flex-col gap-3 items-start text-start">
        <h2>{blogMatch.title}</h2>
        <p className="text-black/75">{blogMatch.desc}</p>
        <p className="text-black/75">
          By{" "}
          <Link href={"/"}>
            <strong className="underline">{blogMatch.author}</strong>
          </Link>{" "}
          • {blogMatch.date} • {blogMatch.length} min&nbsp;read
        </p>
      </div>

      {/* Hero */}
      {blogMatch.image && (
        <Image
          src={blogMatch.image}
          width={1248}
          height={606}
          alt={blogMatch.alt || ""}
          className="w-full dynamic-padding"
          priority
        />
      )}

   {/* Main content wrapper: small = column, md+ = row */}
<div className="dynamic-padding relative w-full h-fit flex flex-col md:flex-row gap-9  ">
  <aside className="col-span-3 hidden md:block xl:col-span-2  max-w-[192px] w-full">
          <div className="sticky top-32 flex flex-col gap-4  w-full">
            <h3 className="uppercase tracking-wide">Timeline</h3>
            <nav className="flex flex-col gap-2">
              {(sections.length ? sections : [{ id: "top", title: "Overview" }]).map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => handleJump(e, s.id)}
                  data-timeline-link={s.id}
                  className="text-black/85 w-full hover:text-black transition-colors line-clamp-1"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
        <article className="col-span-6 xl:col-span-7 flex flex-col gap-10">
          {(sections.length ? sections : [{ id: "top", title: "", body: String(blogMatch.info || "") }]).map(
            (section) => (
              <section id={section.id} key={section.id} className="scroll-mt-28 flex flex-col gap-4">
                {section.title && <h3>{section.title}</h3>}
                <Paragraphs text={section.body} />
              </section>
            )
          )}
        </article>



  {/* Related */}
  <aside className="col-span-3 xl:col-span-3 md:w-[285px] max-w-[285px] w-full">
    <div className="sticky top-32 mt-9 flex flex-col gap-6">
      <h3 className="uppercase tracking-wide">More from the blog</h3>

      {/* List: small = column, md+ = row */}
      <div className="flex flex-col gap-6 max-h-[70vh] overflow-auto pr-1">
        {related
          .filter((_, index) => index <= 2)
          .map((prev, index) => (
            <Link
              key={index}
              href={prev.page}
              className="flex flex-col gap-3 group w-full md:w-[285px]"
            >
              {prev.image && (
                <Image
                  src={prev.image}
                  width={392}
                  height={285}
                  alt={prev.alt || ""}
                  className="w-full h-auto max-w-[392px] max-h-[285px]"
                />
              )}
              <div className="flex flex-col gap-1 w-full">
                <h4 className="group-hover:underline w-full">{prev.title}</h4>
                <p className="text-black/85 w-full">
                  {prev.date} • {prev.length} min&nbsp;read
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  </aside>
</div>
    </div>
  );
}

// d