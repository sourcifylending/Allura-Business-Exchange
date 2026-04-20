import { PageCard } from "@/components/page-card";

export type ApplicationDocumentOption = Readonly<{
  value: string;
  label: string;
}>;

export function ApplicationDocumentUploadForm({
  title,
  description,
  action,
  documentTypes,
  buttonLabel,
  helperText,
  accept,
  hiddenFields,
}: Readonly<{
  title: string;
  description: string;
  action: (formData: FormData) => void | Promise<void>;
  documentTypes: ReadonlyArray<ApplicationDocumentOption>;
  buttonLabel: string;
  helperText: string;
  accept?: string;
  hiddenFields?: ReadonlyArray<Readonly<{ name: string; value: string }>>;
}>) {
  return (
    <PageCard title={title} description={description}>
      <form action={action} className="grid gap-5">
        {hiddenFields?.map((field) => (
          <input key={field.name} type="hidden" name={field.name} value={field.value} />
        ))}
        <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
              Document type
            </span>
            <select
              name="document_type"
              required
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
            >
              <option value="">Choose a type</option>
              {documentTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
              File
            </span>
            <input
              type="file"
              name="file"
              required
              accept={accept}
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-700 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(31,26,18,0.96)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-700 hover:border-accent-300 focus:border-accent-400"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
          >
            {buttonLabel}
          </button>
          <div className="text-sm leading-6 text-ink-600">{helperText}</div>
        </div>
      </form>
    </PageCard>
  );
}
