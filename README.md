# Ocean Guardian

Build a complete, production-quality web application called "AquaSentinel" — an AI-powered marine debris detection and monitoring platform.

IMPORTANT:

Use the attached reference image as the primary visual/design reference. Recreate its overall layout, visual hierarchy, spacing, colors, typography, cards, navigation, dashboard structure, map panel, sonar imagery panel, tables, controls, and dark marine-tech aesthetic.

Do NOT make this a static mockup. Build a fully interactive frontend with realistic mock data and working UI interactions throughout.

==================================================

1. PRODUCT OVERVIEW

==================================================

AquaSentinel is an AI-powered underwater/marine debris detection platform used by marine researchers, survey teams, environmental organizations, and ocean-monitoring teams.

The application allows users to:

- Upload sonar scan/image files

- View sonar imagery

- Run simulated AI debris detection

- See bounding boxes and confidence scores

- Adjust confidence thresholds

- View detections on an interactive map

- Browse detection history

- Generate/view reports

- Export reports as PDF/CSV

- Manage application settings

- Monitor system status

The UI should feel like a professional marine research command center — sophisticated, technical, data-rich, but clean and easy to navigate.

==================================================

2. VISUAL DESIGN

==================================================

Follow the attached reference image closely.

Overall aesthetic:

- Dark navy / almost-black background

- Marine/ocean technology aesthetic

- Cyan/turquoise as the primary accent

- Orange/yellow for medium-confidence detections and warnings

- Red for high-confidence detections

- Subtle blue/cyan glows

- Thin borders

- Rounded cards

- High information density without feeling cluttered

- Professional scientific/research dashboard

- Modern SaaS interface

- Minimal gradients, used tastefully

- Subtle hover animations

- Excellent contrast and readability

Suggested colors:

Background:

#030B14

#07131F

#091724

Primary cyan:

#18D9E6

#20CFE0

#0EA5B7

High confidence:

#EF4444

Medium confidence:

#F59E0B

Low confidence:

#9CA3AF

Text:

#F8FAFC

#CBD5E1

#94A3B8

Borders:

rgba(148,163,184,0.15)

Use CSS variables/design tokens so the entire theme is consistent.

Typography:

Use a modern sans-serif font such as Inter.

Headings should be strong and compact.

Data/table text should be highly readable.

Use icons from Lucide React or another professional icon library. Do not use random emoji icons.

==================================================

3. APPLICATION STRUCTURE

==================================================

Create the following main routes/pages:

/dashboard

/upload

/detections

/reports

/settings

Use a persistent left sidebar on desktop.

On mobile:

- Collapse sidebar into a hamburger menu

- Preserve all functionality

- Make dashboard cards stack vertically

- Make tables horizontally scrollable

- Make map and sonar viewer responsive

==================================================

4. LEFT SIDEBAR

==================================================

Create a fixed dark sidebar similar to the reference image.

Top:

AquaSentinel logo/icon

"AquaSentinel"

Subtitle:

"AI-Powered Marine

Debris Detection"

Navigation:

- Dashboard

- Upload Scan

- Detection History

- Reports

- Settings

Each navigation item should have:

- Lucide icon

- Label

- Active state

- Hover state

Active Dashboard state:

cyan left border/accent

subtle cyan background glow

Bottom of sidebar:

System Status card.

Show:

Green status indicator

"All Systems Operational"

Then:

Version 1.2.3

© 2025 AquaSentinel

On mobile the sidebar should become an overlay/drawer.

==================================================

5. TOP HEADER

==================================================

Main content should have a top header.

Left:

Page title:

"Dashboard"

Subtitle:

"AI-Powered Automated Underwater Detection"

Right:

Search field:

"Search scans, locations, or detections..."

Notification bell with a small red notification indicator.

User profile section:

Circular avatar

"Dr. Aditi Sharma"

"Marine Researcher"

Dropdown arrow

Create a functional profile dropdown with:

- Profile

- Preferences

- Sign out

Search should actually filter/search across mock scans/detections.

==================================================

6. DASHBOARD

==================================================

Create a dashboard closely matching the reference.

At the top create 3 KPI cards.

CARD 1:

Title:

"Total Scans Processed"

Value:

"1,247"

Change:

"↑ 18% vs yesterday"

Use a cyan scan/document icon.

CARD 2:

Title:

"Debris Detected Today"

Value:

"216"

Change:

"↑ 24% vs yesterday"

Use orange detection/target icon.

CARD 3:

Title:

"Average Confidence Score"

Value:

"78.6%"

Change:

"↑ 5.4% vs yesterday"

Use cyan analytics icon.

Cards should have subtle hover effects and small visual polish.

==================================================

7. DASHBOARD MAIN CONTENT

==================================================

Below KPI cards create a two-column layout.

LEFT:

"1. Upload & Live View"

RIGHT:

"2. Map & Report"

On large desktop screens the left side should be approximately 45% and right side 55%.

==================================================

8. UPLOAD & LIVE VIEW PANEL

==================================================

Create a large upload/dropzone area.

Text:

"Drag & drop sonar image logs here"

"or click to browse"

Supported:

"Supports: .xtf, .jpg, .png (Max 200MB)"

Include upload/cloud icon.

Make the upload area functional.

When a user selects a file:

- Show filename

- Show upload status

- Show progress animation

- Then simulate processing

- Display a success state

- Add the scan to detection history

Accept:

.xtf

.jpg

.jpeg

.png

Do not actually need to run a real AI model. Simulate AI processing realistically.

Example uploaded file:

"survey_042.xtf"

Show:

"Uploaded: May 24, 2025 10:42 AM"

with a green success indicator.

==================================================

9. SONAR VIEWER

==================================================

Below the upload section create a professional sonar-image viewer.

Use the attached reference image's sonar imagery style.

If no real sonar image is available, generate a visually similar sonar placeholder using CSS/canvas or use a suitable local/mock asset.

The viewer should look like an underwater sonar scan:

- dark/brown/golden sonar texture

- two side-by-side sonar channels

- vertical center divider

- noise/grain

- detected debris objects

Overlay AI detection bounding boxes.

Example detections:

- Debris — 87%

- Debris — 96%

- Debris — 61%

- Debris — 76%

- Debris — 79%

Color bounding boxes according to confidence:

High >=80% → red

Medium 50–79% → yellow/orange

Low <50% → gray

Each detection label should be positioned over its bounding box.

Make bounding boxes interactive:

- Hover → highlight

- Click → show detection details

- Selected detection gets stronger glow

Add a vertical toolbar on the left side of the sonar viewer:

- Select

- Pan

- Zoom in

- Zoom out

- Fit view

- Brightness/contrast

Make these controls functional or visually respond to interaction.

==================================================

10. CONFIDENCE THRESHOLD

==================================================

Below sonar viewer create:

"Confidence Threshold"

Information icon.

Show:

30% ---- 50% ---- 70% ---- 90% ---- 100%

Create an actual range slider.

Default:

70%

When slider changes:

- Filter visible detections

- Update detection count

- Update displayed confidence categories

- Update map markers

- Update table

Add toggle:

"Show heatmap"

The heatmap toggle should actually change the map visualization.

==================================================

11. DETECTION SUMMARY

==================================================

At bottom of sonar panel show:

"Detections shown: 216"

Then colored indicators:

High: 143

Medium: 52

Low: 21

These values should dynamically update based on the confidence threshold.

==================================================

12. INTERACTIVE MAP

==================================================

Create a professional dark marine map.

Use Mapbox if possible. If an API key is unavailable, create a high-quality simulated map using a dark map-like visualization rather than leaving an empty box.

The map should contain:

- Dark ocean

- Islands/coastline

- Dotted/dashed survey paths

- Detection markers

- Zoom controls

- Layers button

- Location/target button

Show detection markers using confidence colors:

High → red

Medium → orange

Low → gray

Example markers:

8

3

5

etc.

Include a legend in the upper-right:

Confidence

● High (≥ 80%)

● Medium (50% – 79%)

● Low (< 50%)

Include scale indicator:

2 km

Map interactions:

- Zoom

- Pan

- Click detection marker

- Selected marker opens detection information

- Map updates when confidence threshold changes

- Heatmap toggle changes map visualization

==================================================

13. DETECTION TABLE

==================================================

Below map create:

"Detections (216)"

Add search field:

"Search detections..."

Create a modern dark data table.

Columns:

ID

Timestamp (UTC)

Coordinates

Confidence

Type

Example rows:

D-0216

May 24, 2025 10:42:31

26.123456° N, 93.456789° E

96%

Fishing Net

D-0215

May 24, 2025 10:42:10

26.123210° N, 93.456120° E

92%

Metal Object

D-0214

May 24, 2025 10:41:45

26.122980° N, 93.455780° E

81%

Plastic Container

D-0213

May 24, 2025 10:41:20

26.122650° N, 93.455210° E

76%

Rope

D-0212

May 24, 2025 10:40:55

26.122310° N, 93.454950° E

61%

Unknown

D-0211

May 24, 2025 10:40:30

26.121980° N, 93.454300° E

43%

Wood Fragment

Confidence values should be color-coded.

Rows should be clickable.

Clicking a row should open a right-side detail drawer or modal showing:

- Detection ID

- Type

- Confidence

- Timestamp

- Coordinates

- Sonar crop

- Detection status

- AI explanation

- Location on map

Add pagination or virtual scrolling for larger datasets.

==================================================

14. REPORT DOWNLOAD

==================================================

At the bottom of the map/report section create a large button:

"Download Report (PDF / CSV)"

with document/download icon and dropdown arrow.

Make it functional.

Dropdown options:

- Download PDF Report

- Download CSV Data

- Export JSON

When clicked, generate/download realistic report files using the current mock detection data.

PDF report should include:

AquaSentinel logo/name

Survey information

Summary statistics

Detection counts

Confidence distribution

Detection table

Coordinates

Timestamp

Report generation date

CSV should contain all detection records.

==================================================

15. UPLOAD PAGE

==================================================

Create a dedicated /upload page.

Title:

"Upload Scan"

Subtitle:

"Upload underwater sonar data for AI-powered debris detection."

Include:

- Large drag/drop upload area

- File picker

- Supported file formats

- Upload progress

- Processing animation

- Processing steps

Example processing stages:

1. Uploading scan

2. Validating sonar data

3. Preprocessing imagery

4. Running AI detection

5. Calculating confidence scores

6. Generating report

After processing:

Show:

"Analysis Complete"

Then show:

- Number of detections

- Average confidence

- High/medium/low counts

- Button "View Results"

==================================================

16. DETECTION HISTORY PAGE

==================================================

Create a full detection history page.

Top:

"Detection History"

Subtitle:

"Review and analyze previous underwater surveys."

Add filters:

- Date range

- Location

- Confidence

- Debris type

- Processing status

Add search.

Create a professional table/card list containing previous scans:

- Scan ID

- Filename

- Date

- Location

- Detections

- Avg confidence

- Status

- Actions

Example:

SCAN-042

survey_042.xtf

May 24, 2025

26.12°N, 93.45°E

216 detections

78.6%

Completed

Clicking a scan should open its analysis details.

==================================================

17. REPORTS PAGE

==================================================

Create /reports.

Title:

"Reports"

Show report cards/list.

Each report:

- Survey name

- Generated date

- Detection count

- Confidence

- File type

- Status

Actions:

- View

- Download

- Delete

Add "Generate New Report" button.

Create a report preview modal/page with:

- Survey overview

- Map

- Detection statistics

- Confidence distribution

- Detection table

- Notes

- Export controls

==================================================

18. SETTINGS PAGE

==================================================

Create /settings.

Sections:

Profile

- Name

- Role

- Email

- Avatar

Detection Settings

- Default confidence threshold

- Auto-process uploads

- Show heatmap by default

- Enable sound notifications

Map Settings

- Map style

- Default zoom

- Show survey routes

- Show low-confidence detections

Notifications

- Processing completed

- High-confidence detection

- Report generated

- System alerts

Appearance

- Keep dark marine theme

- Compact mode toggle

All settings should have working UI controls and persist during the current session.

==================================================

19. INTERACTIONS & STATE

==================================================

Use realistic application state.

Implement:

- React state/hooks

- Client-side routing

- Search/filtering

- Upload state

- Detection filtering

- Confidence threshold filtering

- Map marker selection

- Detection detail modal/drawer

- Notifications

- Dropdowns

- Tabs

- Toggles

- Sliders

- Pagination

- Export functionality

Avoid dead buttons.

Every major button should perform an action or clearly indicate unavailable functionality.

Use mock data in a clean data layer so it can later be replaced with a real backend/API.

==================================================

20. AI PROCESSING SIMULATION

==================================================

When a user uploads a scan, simulate an AI pipeline.

Display a processing screen with animated progress.

Example:

0–20% Uploading

20–40% Preprocessing

40–70% Sonar analysis

70–90% Object detection

90–100% Confidence scoring

After completion create randomized but realistic detection results.

Detection categories:

- Fishing Net

- Rope

- Plastic Container

- Metal Object

- Wood Fragment

- Tire

- Unknown Debris

Each detection has:

id

timestamp

latitude

longitude

confidence

type

severity

boundingBox

status

==================================================

21. RESPONSIVE DESIGN

==================================================

The website must be fully responsive.

Desktop:

- Fixed sidebar

- Two-column dashboard

- Large map/sonar panels

Tablet:

- Collapsible sidebar

- Adaptive two-column/one-column layout

Mobile:

- Hamburger navigation

- One-column layout

- KPI cards stacked

- Sonar viewer scroll/zoom

- Map responsive

- Tables horizontally scrollable

- Modals/drawers optimized for mobile

Do not allow content to overflow horizontally.

==================================================

22. MICRO-INTERACTIONS

==================================================

Add subtle polished interactions:

- Card hover elevation/glow

- Cyan focus states

- Smooth page transitions

- Button hover states

- Slider animation

- Map marker pulse

- Upload progress animation

- Processing status animation

- Toast notifications

- Skeleton loading states

- Detection box hover glow

- Sidebar transition

Keep animations professional and restrained.

==================================================

23. ACCESSIBILITY

==================================================

Implement:

- Semantic HTML

- Keyboard navigation

- Visible focus states

- Accessible labels

- ARIA labels where appropriate

- Sufficient color contrast

- Do not rely solely on color to communicate status

==================================================

24. TECHNICAL REQUIREMENTS

==================================================

Use:

- React

- TypeScript

- Tailwind CSS

- shadcn/ui where appropriate

- Lucide icons

- React Router

- Recharts for charts

- Mapbox or another suitable map library if available

- Clean reusable components

Structure components logically.

Suggested components:

AppShell

Sidebar

TopHeader

KpiCard

UploadDropzone

SonarViewer

DetectionBoundingBox

ConfidenceSlider

MapPanel

DetectionTable

DetectionDetailDrawer

ReportDownload

ProcessingProgress

NotificationPanel

ProfileMenu

FilterBar

EmptyState

LoadingState

Toast

Use reusable data types/interfaces for scans and detections.

==================================================

25. CHARTS / ANALYTICS

==================================================

Where appropriate, include subtle analytics visualizations:

- Confidence distribution

- Detection type distribution

- Detections over time

- Scan processing volume

Charts should follow the AquaSentinel dark theme and not overwhelm the interface.

==================================================

26. MOCK DATA

==================================================

Populate the application with enough realistic mock data that every page looks complete on first load.

Use at least:

- 20+ detection records

- 8+ scans

- Multiple locations

- Different debris types

- Different confidence levels

- Different timestamps

The dashboard should initially reproduce the key numbers shown in the reference:

1,247 total scans

216 debris detected today

78.6% average confidence

216 detections

==================================================

27. IMPORTANT VISUAL DETAILS FROM REFERENCE

==================================================

Pay special attention to these elements from the attached reference:

- Very dark navy background

- Cyan AquaSentinel branding

- Left navigation sidebar

- Three large KPI cards across the top

- "1. Upload & Live View" section

- "2. Map & Report" section

- Sonar image viewer with orange/brown underwater imagery

- Detection bounding boxes

- Confidence labels

- Interactive confidence threshold slider

- Dark map with cyan survey route

- Red/orange/gray detection markers

- Detection table

- Large "Download Report (PDF / CSV)" button

- Small system-status card in bottom-left sidebar

- Researcher profile in top-right

- Dense but polished data visualization

- Thin cyan borders and subtle glowing accents

The final UI should look extremely close in spirit and composition to the attached screenshot while being a complete functional application rather than a screenshot recreation.

==================================================

28. QUALITY BAR

==================================================

This should look like a real startup/product that could be shown to:

- Marine researchers

- Government environmental agencies

- Ocean conservation organizations

- Research institutions

- Investors

- Technical stakeholders

Do not make it look like a generic admin dashboard.

Do not use excessive gradients.

Do not use giant text.

Do not use excessive rounded/pill UI.

Do not use generic placeholder sections.

Do not leave pages empty.

Do not create non-functional navigation.

Prioritize:

1. Visual fidelity to the attached reference

2. Professional marine research aesthetic

3. Functional interactions

4. Responsive design

5. Clean reusable architecture

6. Realistic mock data

7. Excellent UX

Build the entire application now, including all routes, components, mock data, interactions, responsive layouts, upload simulation, sonar visualization, map visualization, detection filtering, detail views, report generation, and settings.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aquasentinel2.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0624fe88-9d28-4ddd-978c-6eb1bd9b6934).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
