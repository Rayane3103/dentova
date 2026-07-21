"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  ListChecks,
  Plus,
  Trash2,
  Type
} from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { CourseQuestion } from "@/types";

type CourseQuestionsBuilderProps = {
  value: CourseQuestion[];
  onChange: (questions: CourseQuestion[]) => void;
};

function createQuestionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyQuestion(): CourseQuestion {
  return {
    id: createQuestionId(),
    label: "",
    type: "text",
    required: false,
    options: [],
    allowMultiple: false
  };
}

export function CourseQuestionsBuilder({
  value,
  onChange
}: CourseQuestionsBuilderProps) {
  const updateQuestion = (index: number, patch: Partial<CourseQuestion>) => {
    onChange(
      value.map((question, itemIndex) =>
        itemIndex === index ? { ...question, ...patch } : question
      )
    );
  };

  const removeQuestion = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) {
      return;
    }

    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const setType = (index: number, type: CourseQuestion["type"]) => {
    if (type === "select") {
      const current = value[index];
      updateQuestion(index, {
        type,
        options: current.options.length > 0 ? current.options : [""]
      });
      return;
    }

    updateQuestion(index, { type, allowMultiple: false });
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    optionValue: string
  ) => {
    const options = [...value[questionIndex].options];
    options[optionIndex] = optionValue;
    updateQuestion(questionIndex, { options });
  };

  const addOption = (questionIndex: number) => {
    updateQuestion(questionIndex, {
      options: [...value[questionIndex].options, ""]
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    updateQuestion(questionIndex, {
      options: value[questionIndex].options.filter(
        (_, itemIndex) => itemIndex !== optionIndex
      )
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">
            Questions personnalisées
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            Ajoutez des questions posées lors de la réservation de cette
            formation.
          </p>
        </div>
        <button
          className="dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg border border-dentova-teal/40 bg-white px-3 text-xs font-bold text-dentova-navy transition hover:border-dentova-teal hover:bg-dentova-mint/40"
          onClick={() => onChange([...value, emptyQuestion()])}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Ajouter une question
        </button>
      </div>

      {value.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
          <ListChecks className="h-6 w-6 text-slate-400" />
          <p className="mt-2 text-xs font-medium text-slate-500">
            Aucune question. Le formulaire de réservation restera standard.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {value.map((question, index) => (
            <div
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              key={question.id}
            >
              <div className="flex items-start gap-2">
                <div className="mt-1 flex flex-col items-center gap-0.5 text-slate-300">
                  <button
                    aria-label="Monter"
                    className="dentova-focus rounded transition hover:text-slate-600 disabled:opacity-30"
                    disabled={index === 0}
                    onClick={() => moveQuestion(index, -1)}
                    type="button"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <GripVertical className="h-3.5 w-3.5" />
                  <button
                    aria-label="Descendre"
                    className="dentova-focus rounded transition hover:text-slate-600 disabled:opacity-30"
                    disabled={index === value.length - 1}
                    onClick={() => moveQuestion(index, 1)}
                    type="button"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-dentova-mint text-[11px] font-bold text-dentova-navy">
                      {index + 1}
                    </span>
                    <Input
                      onChange={(event) =>
                        updateQuestion(index, { label: event.target.value })
                      }
                      placeholder="Intitulé de la question"
                      size="sm"
                      value={question.label}
                    />
                    <button
                      aria-label="Supprimer la question"
                      className="dentova-focus inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeQuestion(index)}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                      <button
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition",
                          question.type === "text"
                            ? "bg-white text-dentova-navy shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        )}
                        onClick={() => setType(index, "text")}
                        type="button"
                      >
                        <Type className="h-3.5 w-3.5" />
                        Texte libre
                      </button>
                      <button
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition",
                          question.type === "select"
                            ? "bg-white text-dentova-navy shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        )}
                        onClick={() => setType(index, "select")}
                        type="button"
                      >
                        <ListChecks className="h-3.5 w-3.5" />
                        Choix
                      </button>
                    </div>

                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                      <Checkbox
                        checked={question.required}
                        onChange={(event) =>
                          updateQuestion(index, {
                            required: event.target.checked
                          })
                        }
                      />
                      Obligatoire
                    </label>

                    {question.type === "select" ? (
                      <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                        <Checkbox
                          checked={question.allowMultiple}
                          onChange={(event) =>
                            updateQuestion(index, {
                              allowMultiple: event.target.checked
                            })
                          }
                        />
                        Choix multiples
                      </label>
                    ) : null}
                  </div>

                  {question.type === "select" ? (
                    <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        Options
                      </p>
                      {question.options.map((option, optionIndex) => (
                        <div
                          className="flex items-center gap-2"
                          key={optionIndex}
                        >
                          <span className="text-xs text-slate-400">
                            {optionIndex + 1}.
                          </span>
                          <Input
                            onChange={(event) =>
                              updateOption(
                                index,
                                optionIndex,
                                event.target.value
                              )
                            }
                            placeholder={`Option ${optionIndex + 1}`}
                            size="sm"
                            value={option}
                          />
                          <button
                            aria-label="Supprimer l'option"
                            className="dentova-focus inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                            disabled={question.options.length <= 1}
                            onClick={() => removeOption(index, optionIndex)}
                            type="button"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        className="dentova-focus inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-dentova-navy transition hover:bg-white"
                        onClick={() => addOption(index)}
                        type="button"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Ajouter une option
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
