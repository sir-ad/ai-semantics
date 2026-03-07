const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    Header, Footer, AlignmentType, LevelFormat,
    HeadingLevel, BorderStyle, WidthType, ShadingType,
    PageBreak, PageNumber } = require('docx');
const fs = require('fs');

const FONT = "Arial";
const ACCENT = "0F172A";
const ACCENT2 = "1E293B";
const HIGHLIGHT = "7C3AED";
const HIGHLIGHT2 = "4F46E5";
const LIGHT_BG = "F5F3FF";
const CONTENT_WIDTH = 9360;

const border = { style: BorderStyle.SINGLE, size: 1, color: "D4D4D8" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text, level = HeadingLevel.HEADING_1) {
    return new Paragraph({ heading: level, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, font: FONT, bold: true, color: ACCENT })] });
}
function h2(text) { return heading(text, HeadingLevel.HEADING_2); }
function h3(text) { return heading(text, HeadingLevel.HEADING_3); }

function para(text, opts = {}) {
    const runs = typeof text === 'string' ? [new TextRun({ text, font: FONT, size: 22, ...opts })] : text;
    return new Paragraph({ spacing: { after: 120 }, children: runs });
}
function bold(t) { return new TextRun({ text: t, font: FONT, size: 22, bold: true }); }
function normal(t) { return new TextRun({ text: t, font: FONT, size: 22 }); }
function accent(t) { return new TextRun({ text: t, font: FONT, size: 22, bold: true, color: HIGHLIGHT }); }
function italic(t) { return new TextRun({ text: t, font: FONT, size: 22, italics: true, color: "71717A" }); }

function bulletList(items, ref = "bullets") {
    return items.map(item => new Paragraph({
        numbering: { reference: ref, level: 0 },
        spacing: { after: 80 },
        children: typeof item === 'string' ? [normal(item)] : item
    }));
}
function numberedList(items) {
    return items.map(item => new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: typeof item === 'string' ? [normal(item)] : item
    }));
}

function tableRow(cells, isHeader = false) {
    const colWidth = Math.floor(CONTENT_WIDTH / cells.length);
    return new TableRow({
        children: cells.map(cell => new TableCell({
            borders,
            margins: cellMargins,
            width: { size: colWidth, type: WidthType.DXA },
            shading: isHeader ? { fill: ACCENT, type: ShadingType.CLEAR } : {},
            children: [new Paragraph({ children: [new TextRun({ text: cell, font: FONT, size: 20, bold: isHeader, color: isHeader ? "FFFFFF" : "27272A" })] })]
        }))
    });
}

function simpleTable(headers, rows) {
    const colWidth = Math.floor(CONTENT_WIDTH / headers.length);
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: headers.map(() => colWidth),
        rows: [tableRow(headers, true), ...rows.map(r => tableRow(r))]
    });
}

function spacer() { return new Paragraph({ spacing: { after: 200 }, children: [] }); }
function divider() {
    return new Paragraph({
        spacing: { before: 240, after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: HIGHLIGHT, space: 4 } },
        children: []
    });
}

function calloutBox(title, text) {
    return new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        rows: [new TableRow({
            children: [new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 8, color: HIGHLIGHT }, bottom: border, left: border, right: border },
                margins: { top: 140, bottom: 140, left: 200, right: 200 },
                width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [
                    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: title, font: FONT, size: 22, bold: true, color: HIGHLIGHT })] }),
                    new Paragraph({ children: [new TextRun({ text, font: FONT, size: 20, color: "3F3F46" })] })
                ]
            })]
        })]
    });
}

// ═══════════════════════════════════════════════════
const doc = new Document({
    styles: {
        default: { document: { run: { font: FONT, size: 22 } } },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 36, bold: true, font: FONT, color: ACCENT },
                paragraph: { spacing: { before: 400, after: 240 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 28, bold: true, font: FONT, color: ACCENT2 },
                paragraph: { spacing: { before: 320, after: 180 }, outlineLevel: 1 }
            },
            {
                id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 24, bold: true, font: FONT, color: ACCENT2 },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
            },
        ]
    },
    numbering: {
        config: [
            { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "sub-bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] },
        ]
    },
    sections: [
        // ═══ COVER ═══
        {
            properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                spacer(), spacer(), spacer(), spacer(), spacer(),
                new Paragraph({
                    alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
                        new TextRun({ text: "GO-TO-MARKET STRATEGY", font: FONT, size: 20, bold: true, color: "A1A1AA", characterSpacing: 200 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
                        new TextRun({ text: "Grain", font: FONT, size: 72, bold: true, color: ACCENT })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
                        new TextRun({ text: "Distribution Playbook for an Open-Source Standard", font: FONT, size: 26, color: "71717A" })
                    ]
                }),
                divider(),
                new Paragraph({
                    alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
                        new TextRun({ text: "How to go from 0 to inevitable", font: FONT, size: 24, italics: true, color: HIGHLIGHT })
                    ]
                }),
                spacer(), spacer(), spacer(), spacer(), spacer(), spacer(),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [normal("Author: Adarsh Singh")] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [normal("Date: March 2026")] }),
            ]
        },

        // ═══ MAIN CONTENT ═══
        {
            properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Grain GTM Strategy", font: FONT, size: 18, color: "A1A1AA", italics: true })] })] }) },
            footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: FONT, size: 18, color: "A1A1AA" }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: "A1A1AA" })] })] }) },
            children: [

                // ═══════════════════════════════════════════════════
                // SECTION 1: THE DISTRIBUTION REALITY
                // ═══════════════════════════════════════════════════
                heading("1. The Distribution Reality for Open-Source Standards"),

                calloutBox(
                    "THE UNCOMFORTABLE TRUTH",
                    "Open-source standards don\u2019t get distributed. They get discovered when the pain of not having them becomes unbearable. Your job isn\u2019t to sell Grain. It\u2019s to be in the right place when a developer curses for the fifth time at their custom AI streaming UI."
                ),
                spacer(),

                para([bold("Grain is not a SaaS product."), normal(" There\u2019s no conversion funnel, no free trial, no pricing page. The GTM for an open-source interaction standard has exactly three distribution channels:")]),
                spacer(),

                numberedList([
                    [bold("Developer-to-Developer (organic): "), normal("Someone uses it, tells someone else. This is 80% of how OSS standards spread.")],
                    [bold("Content-to-Developer (inbound): "), normal("Blog posts, tutorials, conference talks that make developers aware the standard exists.")],
                    [bold("Integration-to-Ecosystem (partnerships): "), normal("Getting Grain baked into tools, frameworks, and AI providers so developers encounter it naturally.")],
                ]),
                spacer(),

                para("Paid acquisition, sales teams, outbound campaigns \u2014 none of these work for open-source standards. What works is making adoption so friction-free that the standard spreads through the path of least resistance."),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 2: THE GTM PHASES
                // ═══════════════════════════════════════════════════
                heading("2. Three-Phase GTM: Seed, Spread, Standardize"),

                h2("Phase 1: SEED (Months 1\u20133)"),
                para([italic("Goal: 50 developers use Grain in real projects. Not thousands. Fifty real ones.")]),
                spacer(),

                para([bold("Why 50, not 5000?"), normal(" Because early adopters of a standard need to be the RIGHT people \u2014 developers who build AI tools, who have audiences, who contribute back. 50 real adopters who blog about Grain are worth more than 5000 npm installs from curiosity.")]),
                spacer(),

                h3("2.1 The Launch Sequence"),
                para("Don\u2019t do a big launch. Standards need credibility before attention. Do a sequence:"),
                spacer(),

                simpleTable(
                    ["Week", "Action", "Channel", "Goal"],
                    [
                        ["1", "Fix bugs, publish to npm", "npm registry", "Packages installable"],
                        ["2", "Build interactive playground", "grain.dev website", "People can try without installing"],
                        ["3", "Write \"Why Every AI Interface Is Broken\"", "Personal blog, dev.to", "Problem awareness"],
                        ["4", "Post on Hacker News: Show HN", "Hacker News", "Developer discovery"],
                        ["5", "Tweet thread: build a Claude UI in 40 lines", "Twitter/X", "Practical demonstration"],
                        ["6", "Submit to JavaScript Weekly, TLDR newsletter", "Email newsletters", "Reach newsletter audiences"],
                        ["7-8", "Reach out to 10 AI tool builders personally", "DM, email", "Get real usage feedback"],
                        ["9-10", "Write \"Grain vs Vercel AI SDK\" honest comparison", "Blog, Reddit r/webdev", "Positioning clarity"],
                        ["11-12", "Give talk at local meetup or online event", "Meetup, YouTube", "Video content + credibility"],
                    ]
                ),
                spacer(),

                h3("2.2 The Content Stack (What to Write)"),
                para("Content for a standard follows a specific hierarchy. You need all four layers:"),
                spacer(),

                simpleTable(
                    ["Layer", "Content Type", "Example", "Audience"],
                    [
                        ["Problem Layer", "Why the problem exists", "\"Every AI chatbot rebuilds the same 10 things\"", "CTOs, tech leads"],
                        ["Solution Layer", "How the standard works", "\"G-Lang: The Markup Language for AI\"", "Senior developers"],
                        ["Practical Layer", "How to use it now", "\"Build a streaming AI chat in 10 minutes\"", "All developers"],
                        ["Depth Layer", "Technical deep-dives", "\"How Grain\u2019s streaming parser handles SSE chunks\"", "OSS contributors"],
                    ]
                ),
                spacer(),

                para([bold("Critical Insight: "), normal("Most OSS projects only write Practical Layer content (tutorials). But for a standard, the Problem Layer is the most important. Developers need to feel the pain before they care about the solution. Your best-performing content will be problem-articulation posts, not tutorials.")]),
                spacer(),

                h3("2.3 The 10 Personal Outreach Targets"),
                para("Identify 10 developers who are actively building AI interfaces and reach out personally. Not cold email \u2014 genuine relationship building. These should be:"),
                spacer(),

                ...bulletList([
                    "Developers building AI wrappers/chatbots (they feel the pain daily)",
                    "Open-source maintainers of AI UI libraries (potential collaborators or competitors)",
                    "Developer advocates at AI companies (Anthropic, OpenAI, Vercel \u2014 they amplify)",
                    "Tech content creators who cover AI developer tools (YouTube, Twitter, newsletters)",
                    "Founders of AI startups who need a standard rendering layer",
                ]),
                spacer(),

                para([bold("The ask is not \"use Grain.\""), normal(" The ask is: \"I\u2019m building a standard for AI interaction rendering. Would love your feedback on the spec. Here\u2019s the playground \u2014 does this match the problems you face?\"")]),

                spacer(),
                calloutBox(
                    "PHASE 1 CHECKPOINT",
                    "You\u2019ve succeeded when: 50 real developers have used Grain in projects, 5+ have written about it or shared it, and you have a clear feedback loop from actual usage. GitHub stars don\u2019t count. Real usage counts."
                ),
                spacer(),

                divider(),

                // ═══ PHASE 2 ═══
                h2("Phase 2: SPREAD (Months 4\u20139)"),
                para([italic("Goal: Grain becomes the default recommendation when someone asks \"how do I render AI interactions?\"")]),
                spacer(),

                h3("2.4 The Integration Play"),
                para("This is where the flywheel starts. Instead of convincing individual developers, embed Grain into the tools they already use."),
                spacer(),

                simpleTable(
                    ["Integration", "What You Build", "Distribution Leverage"],
                    [
                        ["Next.js AI template", "npx create-grain-app with Next.js + Grain", "Every Next.js AI project sees Grain"],
                        ["Vercel AI SDK adapter", "grain-ai-sdk package that wraps their streaming", "Vercel AI SDK users get Grain for free"],
                        ["LangChain output adapter", "LangChain callback that formats output as G-Lang", "LangChain\u2019s 100k+ user base"],
                        ["Cursor/Windsurf snippet", "AI-assisted code snippets for Grain", "AI coding tools suggest Grain naturally"],
                        ["Claude MCP tool", "MCP server that outputs G-Lang", "Claude users encounter Grain through MCP"],
                        ["Shadcn/UI-style components", "Copy-paste Grain components in shadcn style", "The most popular UI distribution model in 2025"],
                    ]
                ),
                spacer(),

                para([bold("The Shadcn Play deserves special attention."), normal(" Shadcn/UI proved that the best distribution for UI components is not an npm package \u2014 it\u2019s copy-paste. Consider releasing Grain components in a \"npx grain add stream\" model where developers own the code. This is how you get adoption without dependency resistance.")]),
                spacer(),

                h3("2.5 The Conference & Community Strategy"),
                para("For a standard, live presence matters because trust matters. Standards need faces."),
                spacer(),

                simpleTable(
                    ["Event Type", "Target", "Talk Title"],
                    [
                        ["AI/ML conferences", "AI Engineer Summit, MLOps meetups", "\"The Missing Layer Between AI and UI\""],
                        ["Frontend conferences", "JSConf India, React India, Next.js Conf", "\"Why AI Frontends Need a Standard\""],
                        ["Open-source events", "FOSS India, GitHub Universe", "\"Building Open Standards for AI\""],
                        ["Company meetups", "Anthropic, Vercel, Supabase meetups", "Lightning talk: \"Grain in 5 minutes\""],
                        ["Online spaces", "Twitter Spaces, Discord AMAs", "\"Ask Me Anything about AI Interface Standards\""],
                    ]
                ),
                spacer(),

                h3("2.6 The Documentation-as-Distribution Strategy"),
                para("For developer tools, documentation IS marketing. Every page of Grain docs should be a landing page."),
                spacer(),

                ...bulletList([
                    [bold("SEO play: "), normal("Target \"AI chat component\", \"streaming text UI\", \"tool call rendering\", \"AI thinking indicator\" \u2014 developers Google these exact phrases")],
                    [bold("Comparison pages: "), normal("grain.dev/compare/vercel-ai-sdk, grain.dev/compare/custom-build \u2014 these rank for commercial-intent searches")],
                    [bold("Migration guides: "), normal("\"Migrate from custom AI UI to Grain\" \u2014 targets developers already in pain")],
                    [bold("Integration guides: "), normal("\"Grain + Next.js\", \"Grain + LangChain\" \u2014 targets existing ecosystem searches")],
                    [bold("Interactive examples: "), normal("Every primitive page should have a live, editable example (like MDN Web Docs)")],
                ]),
                spacer(),

                calloutBox(
                    "PHASE 2 CHECKPOINT",
                    "You\u2019ve succeeded when: \"Use Grain\" is a common answer on Reddit/StackOverflow for AI UI questions. At least 3 framework integrations exist. Weekly npm downloads cross 5,000. You\u2019re invited to speak at conferences, not applying."
                ),
                spacer(),

                divider(),

                // ═══ PHASE 3 ═══
                h2("Phase 3: STANDARDIZE (Months 10\u201318)"),
                para([italic("Goal: Grain is the assumed default. \"Just output G-Lang\" is how developers think.")]),
                spacer(),

                h3("2.7 The Provider Partnership Play"),
                para("This is the endgame move: getting AI model providers to natively support G-Lang output."),
                spacer(),

                ...bulletList([
                    [bold("Anthropic: "), normal("Grain extends MCP naturally. Position as the rendering layer for MCP. Anthropic already thinks in terms of structured output \u2014 G-Lang fits their mental model.")],
                    [bold("OpenAI: "), normal("Structured Outputs + G-Lang JSON schema. If GPT can output valid JSON, it can output valid G-Lang JSON. Propose as a structured output format.")],
                    [bold("Google: "), normal("Gemini\u2019s multimodal output needs a standard rendering spec. Grain provides it.")],
                    [bold("Open-source models: "), normal("Fine-tune adapters that make Llama/Mistral output G-Lang. This is the community play.")],
                ]),
                spacer(),

                para([bold("The key leverage: "), normal("Don\u2019t go to providers asking them to adopt Grain. Go with data: \"500 projects already use Grain to render your model\u2019s output. Here\u2019s how you can make it native.\" Adoption first, partnership second.")]),
                spacer(),

                h3("2.8 The Governance Play"),
                para("Standards need governance to be trusted by enterprises."),
                spacer(),

                ...bulletList([
                    "Form the Grain Working Group (like W3C but lightweight)",
                    "RFC process: any new primitive goes through public review",
                    "Conformance test suite: adapters can prove G-Lang compliance",
                    "Annual \"State of AI Interfaces\" report using Grain adoption data",
                    "Corporate sponsors: companies pay for priority support + governance votes",
                ]),
                spacer(),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 3: THE CONTENT CALENDAR
                // ═══════════════════════════════════════════════════
                heading("3. 90-Day Content Calendar"),

                para("Here\u2019s the specific content you should create, in order, with channels:"),
                spacer(),

                simpleTable(
                    ["Week", "Content Piece", "Channel", "Type"],
                    [
                        ["1", "\"Every AI tool rebuilds the same 10 things\" (problem post)", "Twitter thread + dev.to", "Problem Layer"],
                        ["2", "Interactive playground launches at grain.dev", "Product Hunt, HN", "Demo"],
                        ["3", "\"G-Lang: A Markup Language for AI\" (explainer)", "Blog, HN Show", "Solution Layer"],
                        ["4", "\"Build a streaming AI chat in 40 lines\" (tutorial)", "YouTube + blog", "Practical Layer"],
                        ["5", "\"How we built Grain\u2019s streaming parser\" (deep-dive)", "Blog, Reddit r/programming", "Depth Layer"],
                        ["6", "Grain vs custom build comparison", "Blog, Twitter", "Positioning"],
                        ["7", "\"The 10 AI interaction primitives\" infographic", "Twitter, LinkedIn", "Visual/shareable"],
                        ["8", "Guest post on a popular AI newsletter", "TLDR AI, Ben\u2019s Bites", "Reach"],
                        ["9", "\"Grain + Next.js: AI chat in 5 minutes\" video", "YouTube", "Integration"],
                        ["10", "\"Why AI needs HTML\" (thought leadership)", "Substack/blog", "Problem Layer"],
                        ["11", "Live coding: build a full AI app with Grain", "Twitch/YouTube live", "Community"],
                        ["12", "\"State of AI Interfaces 2026\" report", "Blog, social", "Authority"],
                    ]
                ),
                spacer(),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 4: DISTRIBUTION CHANNELS RANKED
                // ═══════════════════════════════════════════════════
                heading("4. Distribution Channels, Ranked by Impact"),

                para("Not all channels are equal for an open-source standard. Here\u2019s the honest ranking:"),
                spacer(),

                simpleTable(
                    ["Rank", "Channel", "Why It Works", "Effort", "Impact"],
                    [
                        ["1", "Hacker News", "Developer discovery engine for new tools", "Low", "Highest"],
                        ["2", "npm + GitHub presence", "Developers search npm first", "Medium", "Very High"],
                        ["3", "Twitter/X developer circles", "Real-time developer discourse", "Ongoing", "High"],
                        ["4", "Dev newsletters (JS Weekly, TLDR)", "Curated reach to 500k+ devs", "Low", "High"],
                        ["5", "Framework integrations", "Embedded in existing workflows", "High", "Very High (delayed)"],
                        ["6", "YouTube tutorials", "Evergreen, SEO-friendly", "High", "Medium-High"],
                        ["7", "Reddit (r/webdev, r/programming)", "Technical discussion, honest", "Low", "Medium"],
                        ["8", "LinkedIn", "Reaches tech leads, CTOs", "Low", "Medium"],
                        ["9", "Conference talks", "Trust building, face to standard", "High", "Medium (long-term)"],
                        ["10", "Discord community", "Retention, not acquisition", "Ongoing", "Low (acquisition)"],
                    ]
                ),
                spacer(),

                para([bold("The counterintuitive insight: "), normal("Discord communities are where most OSS projects invest early. But for Grain, Discord is a retention channel, not a distribution channel. You don\u2019t need a community of 1000 lurkers. You need 50 builders. Build the community around contributors, not users.")]),
                spacer(),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 5: POSITIONING
                // ═══════════════════════════════════════════════════
                heading("5. Positioning: What Grain Is and Isn\u2019t"),

                para("Positioning matters more for a standard than a product, because you\u2019re defining a category."),
                spacer(),

                simpleTable(
                    ["Grain IS", "Grain ISN\u2019T"],
                    [
                        ["A standard vocabulary for AI interactions", "A UI component library"],
                        ["What HTML was to web pages", "What React is to web apps"],
                        ["Framework-agnostic, platform-agnostic", "Tied to any specific AI model or provider"],
                        ["10 atomic primitives that compose everything", "A kitchen-sink framework with 100 components"],
                        ["Something AI models can output directly", "Something only developers write"],
                        ["Open standard with governance", "One company\u2019s proprietary format"],
                    ]
                ),
                spacer(),

                h3("5.1 The One-Liner (For Different Audiences)"),
                spacer(),

                simpleTable(
                    ["Audience", "One-Liner"],
                    [
                        ["Developer (general)", "\"10 primitives that render any AI interaction on any platform\""],
                        ["Frontend developer", "\"Drop-in AI interaction components. Like shadcn, but for AI.\""],
                        ["AI engineer", "\"A markup language AI models can output that any frontend renders\""],
                        ["CTO / Tech Lead", "\"The standard that eliminates AI UI rebuilding across your products\""],
                        ["AI company / Provider", "\"The rendering standard your models should output\""],
                        ["Investor (if ever relevant)", "\"HTML for AI. 15KB. Zero dependencies. Open standard.\""],
                    ]
                ),
                spacer(),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 6: METRICS
                // ═══════════════════════════════════════════════════
                heading("6. GTM Metrics That Actually Matter"),

                para("For an open-source standard, vanity metrics (stars, downloads) are noise. Here are the signal metrics:"),
                spacer(),

                h3("6.1 Leading Indicators (Track Weekly)"),
                simpleTable(
                    ["Metric", "Why It Matters", "3-Month Target"],
                    [
                        ["GitHub issues from external contributors", "Shows real usage + investment", "20+"],
                        ["Projects using Grain (manually tracked)", "The only metric that truly matters", "50"],
                        ["Blog posts/tweets mentioning Grain", "Organic word-of-mouth signal", "30+"],
                        ["Playground sessions (unique)", "Interest before commitment", "2,000/month"],
                        ["npm downloads (weekly, de-duplicated)", "Installation intent", "500/week"],
                    ]
                ),
                spacer(),

                h3("6.2 Lagging Indicators (Track Monthly)"),
                simpleTable(
                    ["Metric", "Why It Matters", "6-Month Target"],
                    [
                        ["Framework integrations (official)", "Ecosystem penetration", "3"],
                        ["Conference talk invitations", "Industry recognition", "2"],
                        ["AI provider mentions in docs", "Upstream adoption", "1"],
                        ["Enterprise inquiries", "Commercial viability signal", "5"],
                        ["External PRs merged", "Community health", "25"],
                    ]
                ),
                spacer(),

                h3("6.3 Metrics to Ignore"),
                ...bulletList([
                    [bold("GitHub stars: "), normal("Easily gamed, doesn\u2019t correlate with usage. A repo with 10k stars and 0 real users is worthless.")],
                    [bold("Twitter followers: "), normal("Vanity metric. Focus on engagement per post, not follower count.")],
                    [bold("Discord member count: "), normal("100 active contributors > 10,000 lurkers.")],
                    [bold("Total npm downloads: "), normal("CI/CD pipelines inflate this 10x. Look at unique IP downloads if possible.")],
                ]),
                spacer(),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 7: ADARSH-SPECIFIC STRATEGY
                // ═══════════════════════════════════════════════════
                heading("7. Leveraging Your Specific Advantages"),

                para("This section is tailored to your specific situation, Adarsh. Here\u2019s what you uniquely bring to Grain\u2019s GTM:"),
                spacer(),

                h3("7.1 Your Product Leadership Identity"),
                para("You\u2019re an Associate Director of Product at an HRMS company, not a typical OSS maintainer. This is actually an advantage:"),
                spacer(),

                ...bulletList([
                    [bold("Credibility: "), normal("You understand enterprise needs, not just developer needs. This matters when Grain needs enterprise adoption.")],
                    [bold("Content angle: "), normal("\"A product leader\u2019s perspective on AI interface standards\" is a unique voice in a space dominated by pure engineers.")],
                    [bold("Writing style: "), normal("Your Gulzar-meets-Paul-Graham sensibility gives content a distinctive voice. Don\u2019t sanitize it. Lean into it.")],
                    [bold("HROne context: "), normal("You can dogfood Grain in HROne\u2019s AI features. Real production usage from your own company is the strongest signal.")],
                ]),
                spacer(),

                h3("7.2 Your Network Play"),
                ...bulletList([
                    [bold("Uparised CAP mentees: "), normal("Your PM mentees are potential Grain adopters and evangelists in their own companies.")],
                    [bold("Indian tech community: "), normal("India has a massive developer community. Being the Indian voice behind a global standard is powerful positioning.")],
                    [bold("Product Twitter: "), normal("Your audience already follows you for product thinking. \"Product leader builds AI standard\" is a compelling narrative arc.")],
                ]),
                spacer(),

                h3("7.3 Bandwidth Reality"),
                para("You\u2019re running Grain alongside a full-time AD role, a family (with a baby on the way), and the Singrauli portfolio. Be realistic:"),
                spacer(),

                simpleTable(
                    ["Time Block", "GTM Activity", "Hours/Week"],
                    [
                        ["Weekday mornings (30 min)", "Twitter engagement, community replies", "2.5"],
                        ["Saturday morning (2 hours)", "Write one content piece", "2"],
                        ["Sunday morning (2 hours)", "Code: fix bugs, build features", "2"],
                        ["One weeknight (1 hour)", "Personal outreach, email 2-3 people", "1"],
                        ["Monthly (half day)", "One bigger piece: talk prep, deep-dive post", "4"],
                    ]
                ),
                spacer(),

                para([bold("Total: ~11.5 hours/week."), normal(" This is sustainable. Don\u2019t try to do more. Consistency over intensity. One piece of content per week, shipped, is better than three planned and zero shipped.")]),
                spacer(),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 8: THE ANTI-PATTERNS
                // ═══════════════════════════════════════════════════
                heading("8. GTM Anti-Patterns (What NOT to Do)"),

                para("These are the most common mistakes open-source standards make:"),
                spacer(),

                simpleTable(
                    ["Anti-Pattern", "Why It Fails", "What to Do Instead"],
                    [
                        ["Big bang Product Hunt launch", "One-day spike, then silence. Standards need sustained presence, not spikes.", "Slow burn: consistent weekly content for 12 weeks."],
                        ["Building a Discord before having 50 users", "Empty communities kill momentum. Nobody wants to be first in an empty room.", "Use GitHub Discussions until you have 50+ active users."],
                        ["Comparing yourself to HTML/JSON in launch content", "Sounds arrogant. Let others make the comparison.", "Talk about the problem, not the analogy. Let reviewers call it \"HTML for AI.\""],
                        ["Trying to get AI providers on board before usage", "No leverage. They\u2019ll ignore you without adoption data.", "Build adoption first. Approach providers with data: \"500 projects use Grain to render your output.\""],
                        ["Over-engineering before shipping", "Perfect parser with zero users is wasted effort.", "Ship with known limitations. Fix based on real feedback."],
                        ["Writing docs nobody reads", "API reference with zero getting-started guide.", "Invest 80% in getting-started, 20% in API reference."],
                    ]
                ),
                spacer(),

                divider(),

                // ═══════════════════════════════════════════════════
                // SECTION 9: THE FIRST 7 DAYS
                // ═══════════════════════════════════════════════════
                heading("9. The First 7 Days Plan"),

                para("Here\u2019s exactly what to do in the first week, in order:"),
                spacer(),

                simpleTable(
                    ["Day", "Task", "Output", "Time"],
                    [
                        ["Day 1", "Fix critical bugs (extension-registry, MCP adapter, parser)", "Working codebase", "4 hours"],
                        ["Day 2", "Publish all 5 packages to npm under @grain", "npm install grain works", "1 hour"],
                        ["Day 3", "Build the interactive playground (single HTML page)", "grain.dev/playground live", "4 hours"],
                        ["Day 4", "Write the \"Why Every AI Interface Is Broken\" post", "Blog post ready", "3 hours"],
                        ["Day 5", "Create system prompt template for Claude/GPT to output G-Lang", "Template in docs", "2 hours"],
                        ["Day 6", "Post the blog. Share on Twitter. Email 5 people for feedback.", "Content shipped", "2 hours"],
                        ["Day 7", "Rest. Review feedback. Adjust.", "Clarity on next week", "1 hour"],
                    ]
                ),
                spacer(),

                calloutBox(
                    "THE FINAL WORD",
                    "Standards win through inevitability, not persuasion. Every piece of content, every integration, every conversation should make one thing clearer: the world where AI interfaces have a standard is obviously better than the world where they don\u2019t. You\u2019re not selling Grain. You\u2019re making the alternative \u2014 rebuilding the same 10 interaction patterns from scratch, every time \u2014 feel increasingly absurd."
                ),

                spacer(), spacer(),
                divider(),
                para([italic("End of Document. Grain GTM Strategy \u2014 March 2026")]),
            ]
        }
    ]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("/mnt/user-data/outputs/Grain_GTM_Strategy.docx", buffer);
    console.log("GTM Strategy generated.");
});