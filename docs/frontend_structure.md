# 🎨 FRONTEND STRUCTURE & ARCHITECTURE

## 1. 📂 Folder Structure & Routing (Next.js App Router)
The following structure maps directly to the PRD modules.

```
app/
├── (auth)/                 # Authentication Routes (Public)
│   ├── login/
│   └── callback/           # OAuth Callback
├── dashboard/              # Protected Application Routes
│   ├── layout.tsx          # Dashboard Shell (Sidebar, Topbar, Auth Check)
│   ├── page.tsx            # Main "Command Center" (Summary)
│   ├── vision/             # Vision Board Module
│   │   ├── page.tsx        # List of Visions
│   │   └── [id]/           # Vision Detail (Milestones view)
│   ├── milestones/         # All Milestones (List view)
│   ├── planner/            # Daily Execution Planner (Core)
│   ├── progress/           # Analytics & Progress
│   ├── coach/              # AI Coach Interface
│   └── settings/           # User Settings
└── layout.tsx              # Root Layout (Fonts, Global Providers)
```

## 2. 🧩 Component Architecture
We will separate **Data/Layout** (Server) from **Interactivity** (Client).

### Core Components
*   **`components/ui/`**: Reusable atomic elements (Buttons, Cards, Inputs) - *Design System*.
*   **`components/vision/`**:
    *   `VisionCard.tsx`: Display summary, progress bar.
    *   `CreateVisionModal.tsx`: Form to add new vision.
*   **`components/planner/`**:
    *   `DayView.tsx`: The main planner interface.
    *   `TaskPool.tsx`: Sidebar of "Available Tasks" to drag from.
    *   `DailyReflection.tsx`: Text area for end-of-day logging.
*   **`components/tasks/`**:
    *   `TaskItem.tsx`: Checkbox, priority indicator, edit mode.
    *   `CreateTaskDialog.tsx`: Quick add.

## 3. ⚡ State Management & Data Flow
*   **Fetch**: Server Components fetch data directly (`await supabase...`).
*   **Mutate**: Server Actions (`lib/actions/*.ts`) handle CRUD.
*   **Local State**: React `useState` / `useReducer` for complex UI interactions (like the Daily Planner drag-and-drop) before syncing.

### Daily Planner Sync Strategy
1.  **Load**: `page.tsx` fetches `DailyLog` and `Tasks` for the selected date.
2.  **Interact**: User drags task to "Top 3".
3.  **Optimistic UI**: UI updates immediately (Client State).
4.  **Sync**: `planner-actions.ts` -> `assignTaskToDate` called in background.
5.  **Revalidate**: `revalidatePath('/dashboard/planner')` ensures consistency.

## 4. 🔐 Supabase Client Integration
*   `lib/supabase/server.ts`: For Server Components & Actions (Cookie-based auth).
*   `lib/supabase/client.ts`: For Client Components (if needed for real-time or auth events).

## 5. 💅 Styling & Aesthetics
*   **Framework**: Tailwind CSS v4.
*   **Theme**: Dark/Cosmic (Black, Cyan, Indigo).
*   **Animation**: Framer Motion for:
    *   Page transitions.
    *   Task completion checkmarks.
    *   Modal entry/exit.
