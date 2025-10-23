import { type FunctionReference, anyApi } from "convex/server";
import { type GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  app: {
    profiles: {
      completeOnboarding: FunctionReference<
        "mutation",
        "public",
        { data: Record<string, any>; type: "apple_health" | "manual" },
        {
          completed: boolean;
          insights: Array<{
            copy: string;
            metrics?: Record<string, any>;
            title: string;
            type: "sleep" | "activity" | "energy" | "payoff";
            visual?: Record<string, any>;
          }> | null;
        }
      >;
      deleteAccount: FunctionReference<
        "action",
        "public",
        { email: string },
        any
      >;
      getOnboardingStatus: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        {
          completed: boolean;
          completedAt: string | null;
          showInsightsAgain: boolean | null;
        }
      >;
      me: FunctionReference<"query", "public", any, any>;
      remove: FunctionReference<
        "mutation",
        "public",
        { id: Id<"profiles"> },
        any
      >;
      upsert: FunctionReference<
        "mutation",
        "public",
        {
          ageRange?:
            | "under18"
            | "age18To21"
            | "age25To34"
            | "age35To44"
            | "age45To55"
            | "age55To64"
            | "over64"
            | null;
          averageActivityMinute?: number | null;
          averageStepCount?: number | null;
          avgSleepDuration?: number | null;
          energyLevelsEarlyMorning?: number | null;
          energyLevelsEvening?: number | null;
          energyLevelsLateAfternoon?: number | null;
          energyLevelsMidday?: number | null;
          energyLevelsNight?: number | null;
          exerciseFrequency?: number | null;
          exerciseTimingPattern?:
            | "morning"
            | "midday"
            | "afternoon"
            | "evening"
            | "mixed"
            | null;
          firstName?: string | null;
          gender?:
            | "male"
            | "female"
            | "non_binary"
            | "prefer_not_to_say"
            | null;
          hasRegularSleepSchedule?: boolean | null;
          lowEnergyTime?: string | null;
          mood?:
            | "happy"
            | "motivated"
            | "focused"
            | "calm"
            | "grateful"
            | "confident"
            | "optimistic"
            | "inspired"
            | "indifferent"
            | "balanced"
            | "relaxed"
            | "stressed"
            | "anxious"
            | "frustrated"
            | "overwhelmed"
            | "tired"
            | "irritable"
            | "sad"
            | "unmotivated"
            | "disappointed"
            | null;
          mostProductiveTime?: Array<
            | "early_morning"
            | "morning"
            | "midday"
            | "late_afternoon"
            | "evening"
            | "night"
            | "late_night"
          > | null;
          leastProductiveTime?: Array<
            | "early_morning"
            | "morning"
            | "midday"
            | "late_afternoon"
            | "evening"
            | "night"
            | "late_night"
          > | null;
          needsHelpWith?:
            | {
                type: "predefined";
                value: Array<"deep_focus" | "manage_stress" | "structure_day" | "maximize_energy" | "recharge_and_avoid_burnout">;
              }
            | {
                type: "other";
                value: string;
              }
            | null;
          onboardingCompletedAt?: string | null;
          peakFocusTime?: string | null;
          rechargePreferences?: Array<
            | "yoga"
            | "therapy"
            | "workout"
            | "meditation"
            | "walking"
            | "affirmations"
            | "journaling"
            | "digital_detox"
            | "gratitude"
            | "dancing"
            | "naps"
            | "music"
          > | null;
          showInsightsAgain?: boolean | null;
          sleepConsistencyScore?: number | null;
          sleepDuration?: number | null;
          sleepEnd?: string | null;
          sleepStart?: string | null;
          takesBreakRegularly?: boolean | null;
          timeZone?:
            | "Pacific/Baker_Island"
            | "Pacific/Midway"
            | "Pacific/Niue"
            | "Pacific/Honolulu"
            | "Pacific/Tahiti"
            | "Pacific/Marquesas"
            | "America/Anchorage"
            | "America/Juneau"
            | "America/Los_Angeles"
            | "America/Vancouver"
            | "America/Tijuana"
            | "America/Denver"
            | "America/Phoenix"
            | "America/Calgary"
            | "America/Mazatlan"
            | "America/Chicago"
            | "America/Mexico_City"
            | "America/Guatemala"
            | "America/Winnipeg"
            | "America/New_York"
            | "America/Toronto"
            | "America/Havana"
            | "America/Lima"
            | "America/Bogota"
            | "America/Santiago"
            | "America/Caracas"
            | "America/La_Paz"
            | "America/Halifax"
            | "Atlantic/Bermuda"
            | "America/St_Johns"
            | "America/Sao_Paulo"
            | "America/Argentina/Buenos_Aires"
            | "America/Montevideo"
            | "America/Godthab"
            | "Atlantic/South_Georgia"
            | "Atlantic/Azores"
            | "Atlantic/Cape_Verde"
            | "Europe/London"
            | "Europe/Dublin"
            | "Europe/Lisbon"
            | "Africa/Casablanca"
            | "Africa/Accra"
            | "UTC"
            | "Europe/Paris"
            | "Europe/Berlin"
            | "Europe/Rome"
            | "Europe/Madrid"
            | "Europe/Amsterdam"
            | "Europe/Brussels"
            | "Europe/Vienna"
            | "Europe/Prague"
            | "Europe/Warsaw"
            | "Europe/Stockholm"
            | "Europe/Oslo"
            | "Africa/Lagos"
            | "Africa/Algiers"
            | "Europe/Helsinki"
            | "Europe/Luxembourg"
            | "Europe/Athens"
            | "Europe/Istanbul"
            | "Europe/Kiev"
            | "Europe/Bucharest"
            | "Europe/Sofia"
            | "Africa/Cairo"
            | "Africa/Johannesburg"
            | "Asia/Jerusalem"
            | "Europe/Moscow"
            | "Asia/Baghdad"
            | "Asia/Kuwait"
            | "Asia/Riyadh"
            | "Africa/Nairobi"
            | "Africa/Addis_Ababa"
            | "Asia/Tehran"
            | "Asia/Dubai"
            | "Asia/Muscat"
            | "Asia/Baku"
            | "Asia/Tbilisi"
            | "Asia/Yerevan"
            | "Europe/Samara"
            | "Asia/Kabul"
            | "Asia/Karachi"
            | "Asia/Tashkent"
            | "Asia/Yekaterinburg"
            | "Asia/Kolkata"
            | "Asia/Colombo"
            | "Asia/Kathmandu"
            | "Asia/Dhaka"
            | "Asia/Almaty"
            | "Asia/Omsk"
            | "Asia/Yangon"
            | "Asia/Bangkok"
            | "Asia/Jakarta"
            | "Asia/Ho_Chi_Minh"
            | "Asia/Krasnoyarsk"
            | "Asia/Shanghai"
            | "Asia/Hong_Kong"
            | "Asia/Singapore"
            | "Asia/Taipei"
            | "Asia/Manila"
            | "Asia/Kuala_Lumpur"
            | "Asia/Irkutsk"
            | "Australia/Perth"
            | "Asia/Tokyo"
            | "Asia/Seoul"
            | "Asia/Yakutsk"
            | "Australia/Adelaide"
            | "Australia/Darwin"
            | "Australia/Sydney"
            | "Australia/Melbourne"
            | "Australia/Brisbane"
            | "Asia/Vladivostok"
            | "Pacific/Guam"
            | "Australia/Lord_Howe"
            | "Pacific/Noumea"
            | "Asia/Magadan"
            | "Pacific/Auckland"
            | "Pacific/Fiji"
            | "Asia/Kamchatka"
            | "Pacific/Chatham"
            | "Pacific/Tongatapu"
            | "Pacific/Apia"
            | "Pacific/Kiritimati"
            | null;
          workdayEnd?: string | null;
          workdayStart?: string | null;
        },
        any
      >;
    };
    sleep: {
      hasDateSleepData: FunctionReference<
        "query",
        "public",
        { sleepDate: string },
        any
      >;
      sleepCheckIn: FunctionReference<
        "mutation",
        "public",
        { sleepDate: string; sleepEnd: string; sleepStart: string },
        any
      >;
    };
    subtasks: {
      create: FunctionReference<
        "mutation",
        "public",
        { completed?: boolean; order?: number; taskId: string; title: string },
        any
      >;
      get: FunctionReference<
        "query",
        "public",
        { id: Id<"subtasks"> },
        {
          _creationTime: number;
          _id: string;
          completed?: boolean;
          order?: number;
          taskId: string;
          title: string;
          userId: string;
        } | null
      >;
      list: FunctionReference<
        "query",
        "public",
        {
          completed?: boolean;
          order?: "asc" | "desc";
          paginationOpts?: {
            cursor: string | null;
            endCursor?: string;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          taskId: string;
        },
        any
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { id: Id<"subtasks"> },
        any
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          data: {
            completed?: boolean;
            order?: number;
            taskId?: string;
            title?: string;
          };
          id: Id<"subtasks">;
        },
        any
      >;
    };
    activities: {
      create: FunctionReference<
        "mutation",
        "public",
        { activeMinutes?: number; steps?: number },
        any
      >;
      get: FunctionReference<
        "query",
        "public",
        { id: Id<"activities"> },
        {
          _creationTime: number;
          _id: string;
          activeMinutes?: number;
          steps?: number;
          userId: string;
        } | null
      >;
      getById: FunctionReference<
        "query",
        "public",
        { id: Id<"activity_logs"> },
        any
      >;
      list: FunctionReference<
        "query",
        "public",
        {
          endDate?: string;
          order?: "asc" | "desc";
          paginationOpts?: {
            cursor: string | null;
            endCursor?: string;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          startDate?: string;
        },
        any
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { id: Id<"activities"> },
        any
      >;
      submitActivity: FunctionReference<
        "mutation",
        "public",
        {
          activityType?:
            | "Walk"
            | "Run"
            | "Yoga"
            | "Cycling"
            | "Strength"
            | "HIIT"
            | "Swim"
            | "Dance"
            | "Other";
          date?: string;
          duration?: number;
          intensity?: number;
          shouldOverride?: boolean;
          source: "apple_health" | "manual";
          startTime?: string;
          workouts?: Array<{
            activityName: string;
            averageHeartRate?: number;
            calories?: number;
            distance?: number;
            duration: number;
            end: string;
            heartRateSamples?: number;
            id: string;
            start: string;
          }>;
        },
        any
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          data: { activeMinutes?: number; steps?: number };
          id: Id<"activities">;
        },
        any
      >;
    };
    preferences: {
      get: FunctionReference<"query", "public", any, any>;
      getUserToken: FunctionReference<"query", "public", any, any>;
      pausePushNotifications: FunctionReference<"mutation", "public", any, any>;
      recordPushNotificationToken: FunctionReference<
        "mutation",
        "public",
        { token: string },
        any
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { id: Id<"preferences"> },
        any
      >;
      upsert: FunctionReference<
        "mutation",
        "public",
        {
          allowEmailNotifications?: boolean;
          allowPushNotifications?: boolean;
          approachingEnergyPeaksDips?: boolean;
          dailyMorningCheckIn?: boolean;
          midSessionNudges?: boolean;
          primaryCalendarEmail?: string;
          suggestedBreakAfterBackToBack?: boolean;
        },
        any
      >;
    };
    tasks: {
      create: FunctionReference<
        "mutation",
        "public",
        {
          chunks?: Array<number>;
          description?: string | null;
          endDate?: string | null;
          energyRequirement?: number | null;
          estimatedDuration?: number | null;
          isAutoSchedule?: boolean;
          isChunked?: boolean;
          parentTaskId?: string | null;
          priority?: number;
          scheduleType?: "any" | "work_hours" | "non_work_hours" | "weekend";
          startDate?: string | null;
          status?: "todo" | "in_progress" | "completed" | "blocked" | "backlog";
          subtasks?: Array<{
            completed?: boolean;
            order?: number;
            title: string;
          }>;
          tag?: "admin" | "creative" | "deep" | "personal";
          title: string;
        },
        any
      >;
      get: FunctionReference<"query", "public", { id: Id<"tasks"> }, any>;
      getTaskWithChunks: FunctionReference<
        "query",
        "public",
        { id: Id<"tasks"> },
        any
      >;
      list: FunctionReference<
        "query",
        "public",
        {
          endDate?: string;
          order?: "asc" | "desc";
          paginationOpts?: {
            cursor: string | null;
            endCursor?: string;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          priority?: number;
          startDate?: string;
          status?: "todo" | "in_progress" | "completed" | "blocked" | "backlog";
          tag?: "admin" | "creative" | "deep" | "personal";
        },
        any
      >;
      remove: FunctionReference<"mutation", "public", { id: Id<"tasks"> }, any>;
      search: FunctionReference<"query", "public", { query: string }, any>;
      suggestTasksWithAI: FunctionReference<
        "mutation",
        "public",
        { limit?: number },
        any
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          data: {
            chunks?: Array<number>;
            description?: string | null;
            endDate?: string | null;
            energyRequirement?: number | null;
            estimatedDuration?: number | null;
            isAutoSchedule?: boolean;
            isChunked?: boolean;
            parentTaskId?: string | null;
            priority?: number;
            scheduleType?: "any" | "work_hours" | "non_work_hours" | "weekend";
            startDate?: string | null;
            status?:
              | "todo"
              | "in_progress"
              | "completed"
              | "blocked"
              | "backlog";
            tag?: "admin" | "creative" | "deep" | "personal";
            title?: string;
          };
          id: string;
        },
        any
      >;
    };
    energy: {
      analyzeEnergyHistory: FunctionReference<"query", "public", any, any>;
      averageHistoryLastWeek: FunctionReference<"query", "public", any, any>;
      estimateFutureForecast: FunctionReference<
        "query",
        "public",
        { daysToForecast?: number },
        any
      >;
      generateForecast: FunctionReference<
        "mutation",
        "public",
        {
          body?: {
            samples: Array<{
              endDate: string;
              sourceId: string;
              sourceName: string;
              startDate: string;
              value: "INBED" | "ASLEEP" | "AWAKE" | "CORE" | "DEEP" | "REM";
            }>;
          };
        },
        any
      >;
      getLatestForecast: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        any
      >;
      getTodayForecast: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        any
      >;
    };
    googleCalendar: {
      createEvent: FunctionReference<
        "mutation",
        "public",
        {
          attendees?: Array<{
            additionalGuests?: number;
            comment?: string;
            displayName?: string | null;
            email: string;
            id?: string;
            optional?: boolean;
            organizer?: boolean;
            resource?: boolean;
            responseStatus?:
              | "needsAction"
              | "declined"
              | "tentative"
              | "accepted";
            self?: boolean;
          }>;
          calendarEmail?: string | null;
          calendarId?: string | null;
          created?: string | null;
          creator?: {
            displayName?: string | null;
            email?: string | null;
            id?: string | null;
            self?: boolean;
          } | null;
          description?: string | null;
          endDate?: string | null;
          htmlLink?: string | null;
          location?: string | null;
          meetingLinks?: Array<{
            label?: string;
            passcode?: string;
            pin?: string;
            platform?: string;
            type: "video" | "phone" | "more";
            url: string;
          }>;
          organizer?: {
            displayName?: string | null;
            email?: string | null;
            id?: string | null;
            self?: boolean;
          } | null;
          recurrence?: Array<string>;
          startDate?: string | null;
          status?: string | null;
          summary?: string | null;
          updated?: string | null;
        },
        any
      >;
      createOAuthFlowUrlAction: FunctionReference<
        "action",
        "public",
        { redirectUri?: string },
        any
      >;
      getCalendar: FunctionReference<
        "query",
        "public",
        { id: Id<"googleCalendars"> },
        any
      >;
      getEvent: FunctionReference<
        "query",
        "public",
        { id: Id<"googleCalendarEvents"> },
        any
      >;
      listCalendarAccounts: FunctionReference<"query", "public", any, any>;
      listCalendars: FunctionReference<"query", "public", any, any>;
      listEvents: FunctionReference<
        "query",
        "public",
        { endDate?: string; startDate?: string },
        any
      >;
      listEventsWithSync: FunctionReference<
        "action",
        "public",
        {
          calendarEmail: string;
          query: { endDate: string; startDate: string };
          userId: string;
        },
        any
      >;
      removeEvent: FunctionReference<
        "mutation",
        "public",
        { id: Id<"googleCalendarEvents"> },
        any
      >;
      unlinkCalendar: FunctionReference<"mutation", "public", any, any>;
      updateEvent: FunctionReference<
        "mutation",
        "public",
        {
          event: {
            attendees?: Array<{
              additionalGuests?: number;
              comment?: string;
              displayName?: string | null;
              email: string;
              id?: string;
              optional?: boolean;
              organizer?: boolean;
              resource?: boolean;
              responseStatus?:
                | "needsAction"
                | "declined"
                | "tentative"
                | "accepted";
              self?: boolean;
            }>;
            calendarEmail?: string | null;
            calendarId?: string | null;
            created?: string | null;
            creator?: {
              displayName?: string | null;
              email?: string | null;
              id?: string | null;
              self?: boolean;
            } | null;
            description?: string | null;
            endDate?: string | null;
            htmlLink?: string | null;
            location?: string | null;
            meetingLinks?: Array<{
              label?: string;
              passcode?: string;
              pin?: string;
              platform?: string;
              type: "video" | "phone" | "more";
              url: string;
            }>;
            organizer?: {
              displayName?: string | null;
              email?: string | null;
              id?: string | null;
              self?: boolean;
            } | null;
            recurrence?: Array<string>;
            startDate?: string | null;
            status?: string | null;
            summary?: string | null;
            updated?: string | null;
          };
          id: Id<"googleCalendarEvents">;
        },
        any
      >;
    };
    schedules: {
      create: FunctionReference<
        "mutation",
        "public",
        {
          data: {
            chunks?: Array<number>;
            description?: string | null;
            endDate?: string | null;
            energyRequirement?: number | null;
            estimatedDuration?: number | null;
            isAutoSchedule?: boolean;
            isChunked?: boolean;
            parentTaskId?: string | null;
            priority?: number;
            scheduleType?: "any" | "work_hours" | "non_work_hours" | "weekend";
            startDate?: string | null;
            status?:
              | "todo"
              | "in_progress"
              | "completed"
              | "blocked"
              | "backlog";
            subtasks?: Array<{
              completed?: boolean;
              order?: number;
              title: string;
            }>;
            tag?: "admin" | "creative" | "deep" | "personal";
            title: string;
          };
          type: "task" | "event";
        },
        any
      >;
      get: FunctionReference<"query", "public", { id: string }, any>;
      getCombined: FunctionReference<
        "query",
        "public",
        {
          calendarEmail?: string;
          endDate?: string;
          order?: "asc" | "desc";
          paginationOpts?: {
            cursor: string | null;
            endCursor?: string;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          startDate?: string;
        },
        any
      >;
      remove: FunctionReference<"mutation", "public", { id: string }, any>;
      searchSchedule: FunctionReference<
        "query",
        "public",
        { query: string },
        any
      >;
      smartSchedule: FunctionReference<
        "mutation",
        "public",
        { id: string },
        any
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          data: {
            chunks?: Array<number>;
            description?: string | null;
            endDate?: string | null;
            energyRequirement?: number | null;
            estimatedDuration?: number | null;
            isAutoSchedule?: boolean;
            isChunked?: boolean;
            parentTaskId?: string | null;
            priority?: number;
            scheduleType?: "any" | "work_hours" | "non_work_hours" | "weekend";
            startDate?: string | null;
            status?:
              | "todo"
              | "in_progress"
              | "completed"
              | "blocked"
              | "backlog";
            tag?: "admin" | "creative" | "deep" | "personal";
            title?: string;
          };
          id: string;
        },
        any
      >;
    };
    tips: {
      generate: FunctionReference<
        "mutation",
        "public",
        Record<string, never>,
        { status: string }
      >;
      get: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        {
          _creationTime: number;
          _id: string;
          content: Array<{
            category:
              | "productivity"
              | "wellness"
              | "energy"
              | "sleep"
              | "focus";
            order?: number;
            tip: string;
          }>;
          lastGeneratedAt?: number;
          userId: string;
        } | null
      >;
    };
    planner: {
      checkAvailability: FunctionReference<
        "query",
        "public",
        {
          endDate?: string;
          maxEnergy?: number;
          minEnergy?: number;
          schedulingDays?: number;
          startDate?: string;
          taskDuration: number;
          taskTag?: "deep" | "creative" | "admin" | "personal" | null;
        },
        any
      >;
    };
    chat: {
      createThread: FunctionReference<
        "mutation",
        "public",
        { prompt: string },
        any
      >;
      sendMessage: FunctionReference<
        "mutation",
        "public",
        { prompt: string; threadId: string },
        any
      >;
      listThreadMessages: FunctionReference<
        "query",
        "public",
        {
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          streamArgs?:
            | { kind: "list"; startOrder?: number }
            | {
                cursors: Array<{ cursor: number; streamId: string }>;
                kind: "deltas";
              };
          threadId: string;
        },
        any
      >;
      listThreads: FunctionReference<
        "query",
        "public",
        {
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
        },
        any
      >;
    };
  };
  playground: {
    createThread: FunctionReference<
      "mutation",
      "public",
      {
        agentName?: string;
        apiKey: string;
        summary?: string;
        title?: string;
        userId: string;
      },
      { threadId: string }
    >;
    fetchPromptContext: FunctionReference<
      "action",
      "public",
      {
        agentName: string;
        apiKey: string;
        beforeMessageId?: string;
        contextOptions: {
          excludeToolMessages?: boolean;
          recentMessages?: number;
          searchOptions?: {
            limit: number;
            messageRange?: { after: number; before: number };
            textSearch?: boolean;
            vectorScoreThreshold?: number;
            vectorSearch?: boolean;
          };
          searchOtherThreads?: boolean;
        };
        messages?: Array<
          | {
              content:
                | string
                | Array<
                    | {
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        text: string;
                        type: "text";
                      }
                    | {
                        image: string | ArrayBuffer;
                        mimeType?: string;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "image";
                      }
                    | {
                        data: string | ArrayBuffer;
                        filename?: string;
                        mimeType: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "file";
                      }
                  >;
              providerOptions?: Record<string, Record<string, any>>;
              role: "user";
            }
          | {
              content:
                | string
                | Array<
                    | {
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        text: string;
                        type: "text";
                      }
                    | {
                        data: string | ArrayBuffer;
                        filename?: string;
                        mimeType: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "file";
                      }
                    | {
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        signature?: string;
                        text: string;
                        type: "reasoning";
                      }
                    | {
                        data: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "redacted-reasoning";
                      }
                    | {
                        args: any;
                        providerExecuted?: boolean;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        toolCallId: string;
                        toolName: string;
                        type: "tool-call";
                      }
                    | {
                        args?: any;
                        experimental_content?: Array<
                          | { text: string; type: "text" }
                          | { data: string; mimeType?: string; type: "image" }
                        >;
                        isError?: boolean;
                        output?:
                          | { type: "text"; value: string }
                          | { type: "json"; value: any }
                          | { type: "error-text"; value: string }
                          | { type: "error-json"; value: any }
                          | {
                              type: "content";
                              value: Array<
                                | { text: string; type: "text" }
                                | {
                                    data: string;
                                    mediaType: string;
                                    type: "media";
                                  }
                              >;
                            };
                        providerExecuted?: boolean;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        result?: any;
                        toolCallId: string;
                        toolName: string;
                        type: "tool-result";
                      }
                    | {
                        id: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        sourceType: "url";
                        title?: string;
                        type: "source";
                        url: string;
                      }
                    | {
                        filename?: string;
                        id: string;
                        mediaType: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        sourceType: "document";
                        title: string;
                        type: "source";
                      }
                  >;
              providerOptions?: Record<string, Record<string, any>>;
              role: "assistant";
            }
          | {
              content: Array<{
                args?: any;
                experimental_content?: Array<
                  | { text: string; type: "text" }
                  | { data: string; mimeType?: string; type: "image" }
                >;
                isError?: boolean;
                output?:
                  | { type: "text"; value: string }
                  | { type: "json"; value: any }
                  | { type: "error-text"; value: string }
                  | { type: "error-json"; value: any }
                  | {
                      type: "content";
                      value: Array<
                        | { text: string; type: "text" }
                        | { data: string; mediaType: string; type: "media" }
                      >;
                    };
                providerExecuted?: boolean;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                result?: any;
                toolCallId: string;
                toolName: string;
                type: "tool-result";
              }>;
              providerOptions?: Record<string, Record<string, any>>;
              role: "tool";
            }
          | {
              content: string;
              providerOptions?: Record<string, Record<string, any>>;
              role: "system";
            }
        >;
        searchText?: string;
        targetMessageId?: string;
        threadId?: string;
        userId?: string;
      },
      any
    >;
    generateText: FunctionReference<
      "action",
      "public",
      {
        agentName: string;
        apiKey: string;
        contextOptions?: {
          excludeToolMessages?: boolean;
          recentMessages?: number;
          searchOptions?: {
            limit: number;
            messageRange?: { after: number; before: number };
            textSearch?: boolean;
            vectorScoreThreshold?: number;
            vectorSearch?: boolean;
          };
          searchOtherThreads?: boolean;
        };
        messages?: Array<
          | {
              content:
                | string
                | Array<
                    | {
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        text: string;
                        type: "text";
                      }
                    | {
                        image: string | ArrayBuffer;
                        mimeType?: string;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "image";
                      }
                    | {
                        data: string | ArrayBuffer;
                        filename?: string;
                        mimeType: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "file";
                      }
                  >;
              providerOptions?: Record<string, Record<string, any>>;
              role: "user";
            }
          | {
              content:
                | string
                | Array<
                    | {
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        text: string;
                        type: "text";
                      }
                    | {
                        data: string | ArrayBuffer;
                        filename?: string;
                        mimeType: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "file";
                      }
                    | {
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        signature?: string;
                        text: string;
                        type: "reasoning";
                      }
                    | {
                        data: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        type: "redacted-reasoning";
                      }
                    | {
                        args: any;
                        providerExecuted?: boolean;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        toolCallId: string;
                        toolName: string;
                        type: "tool-call";
                      }
                    | {
                        args?: any;
                        experimental_content?: Array<
                          | { text: string; type: "text" }
                          | { data: string; mimeType?: string; type: "image" }
                        >;
                        isError?: boolean;
                        output?:
                          | { type: "text"; value: string }
                          | { type: "json"; value: any }
                          | { type: "error-text"; value: string }
                          | { type: "error-json"; value: any }
                          | {
                              type: "content";
                              value: Array<
                                | { text: string; type: "text" }
                                | {
                                    data: string;
                                    mediaType: string;
                                    type: "media";
                                  }
                              >;
                            };
                        providerExecuted?: boolean;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        result?: any;
                        toolCallId: string;
                        toolName: string;
                        type: "tool-result";
                      }
                    | {
                        id: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        sourceType: "url";
                        title?: string;
                        type: "source";
                        url: string;
                      }
                    | {
                        filename?: string;
                        id: string;
                        mediaType: string;
                        providerMetadata?: Record<string, Record<string, any>>;
                        providerOptions?: Record<string, Record<string, any>>;
                        sourceType: "document";
                        title: string;
                        type: "source";
                      }
                  >;
              providerOptions?: Record<string, Record<string, any>>;
              role: "assistant";
            }
          | {
              content: Array<{
                args?: any;
                experimental_content?: Array<
                  | { text: string; type: "text" }
                  | { data: string; mimeType?: string; type: "image" }
                >;
                isError?: boolean;
                output?:
                  | { type: "text"; value: string }
                  | { type: "json"; value: any }
                  | { type: "error-text"; value: string }
                  | { type: "error-json"; value: any }
                  | {
                      type: "content";
                      value: Array<
                        | { text: string; type: "text" }
                        | { data: string; mediaType: string; type: "media" }
                      >;
                    };
                providerExecuted?: boolean;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                result?: any;
                toolCallId: string;
                toolName: string;
                type: "tool-result";
              }>;
              providerOptions?: Record<string, Record<string, any>>;
              role: "tool";
            }
          | {
              content: string;
              providerOptions?: Record<string, Record<string, any>>;
              role: "system";
            }
        >;
        prompt?: string;
        storageOptions?: { saveMessages?: "all" | "none" | "promptAndOutput" };
        system?: string;
        threadId: string;
        userId: string;
      },
      {
        messages: Array<{
          _creationTime: number;
          _id: string;
          agentName?: string;
          embeddingId?: string;
          error?: string;
          fileIds?: Array<string>;
          finishReason?:
            | "stop"
            | "length"
            | "content-filter"
            | "tool-calls"
            | "error"
            | "other"
            | "unknown";
          id?: string;
          message?:
            | {
                content:
                  | string
                  | Array<
                      | {
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          text: string;
                          type: "text";
                        }
                      | {
                          image: string | ArrayBuffer;
                          mimeType?: string;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "image";
                        }
                      | {
                          data: string | ArrayBuffer;
                          filename?: string;
                          mimeType: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "file";
                        }
                    >;
                providerOptions?: Record<string, Record<string, any>>;
                role: "user";
              }
            | {
                content:
                  | string
                  | Array<
                      | {
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          text: string;
                          type: "text";
                        }
                      | {
                          data: string | ArrayBuffer;
                          filename?: string;
                          mimeType: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "file";
                        }
                      | {
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          signature?: string;
                          text: string;
                          type: "reasoning";
                        }
                      | {
                          data: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "redacted-reasoning";
                        }
                      | {
                          args: any;
                          providerExecuted?: boolean;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          toolCallId: string;
                          toolName: string;
                          type: "tool-call";
                        }
                      | {
                          args?: any;
                          experimental_content?: Array<
                            | { text: string; type: "text" }
                            | { data: string; mimeType?: string; type: "image" }
                          >;
                          isError?: boolean;
                          output?:
                            | { type: "text"; value: string }
                            | { type: "json"; value: any }
                            | { type: "error-text"; value: string }
                            | { type: "error-json"; value: any }
                            | {
                                type: "content";
                                value: Array<
                                  | { text: string; type: "text" }
                                  | {
                                      data: string;
                                      mediaType: string;
                                      type: "media";
                                    }
                                >;
                              };
                          providerExecuted?: boolean;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          result?: any;
                          toolCallId: string;
                          toolName: string;
                          type: "tool-result";
                        }
                      | {
                          id: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          sourceType: "url";
                          title?: string;
                          type: "source";
                          url: string;
                        }
                      | {
                          filename?: string;
                          id: string;
                          mediaType: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          sourceType: "document";
                          title: string;
                          type: "source";
                        }
                    >;
                providerOptions?: Record<string, Record<string, any>>;
                role: "assistant";
              }
            | {
                content: Array<{
                  args?: any;
                  experimental_content?: Array<
                    | { text: string; type: "text" }
                    | { data: string; mimeType?: string; type: "image" }
                  >;
                  isError?: boolean;
                  output?:
                    | { type: "text"; value: string }
                    | { type: "json"; value: any }
                    | { type: "error-text"; value: string }
                    | { type: "error-json"; value: any }
                    | {
                        type: "content";
                        value: Array<
                          | { text: string; type: "text" }
                          | { data: string; mediaType: string; type: "media" }
                        >;
                      };
                  providerExecuted?: boolean;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  result?: any;
                  toolCallId: string;
                  toolName: string;
                  type: "tool-result";
                }>;
                providerOptions?: Record<string, Record<string, any>>;
                role: "tool";
              }
            | {
                content: string;
                providerOptions?: Record<string, Record<string, any>>;
                role: "system";
              };
          model?: string;
          order: number;
          provider?: string;
          providerMetadata?: Record<string, Record<string, any>>;
          providerOptions?: Record<string, Record<string, any>>;
          reasoning?: string;
          reasoningDetails?: Array<
            | {
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                signature?: string;
                text: string;
                type: "reasoning";
              }
            | { signature?: string; text: string; type: "text" }
            | { data: string; type: "redacted" }
          >;
          sources?: Array<
            | {
                id: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                sourceType: "url";
                title?: string;
                type?: "source";
                url: string;
              }
            | {
                filename?: string;
                id: string;
                mediaType: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                sourceType: "document";
                title: string;
                type: "source";
              }
          >;
          status: "pending" | "success" | "failed";
          stepOrder: number;
          text?: string;
          threadId: string;
          tool: boolean;
          usage?: {
            cachedInputTokens?: number;
            completionTokens: number;
            promptTokens: number;
            reasoningTokens?: number;
            totalTokens: number;
          };
          userId?: string;
          warnings?: Array<
            | { details?: string; setting: string; type: "unsupported-setting" }
            | { details?: string; tool: any; type: "unsupported-tool" }
            | { message: string; type: "other" }
          >;
        }>;
        text: string;
      }
    >;
    isApiKeyValid: FunctionReference<
      "query",
      "public",
      { apiKey: string },
      boolean
    >;
    listAgents: FunctionReference<
      "query",
      "public",
      { apiKey: string; threadId?: string; userId?: string },
      any
    >;
    listMessages: FunctionReference<
      "query",
      "public",
      {
        apiKey: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        streamArgs?:
          | { kind: "list"; startOrder?: number }
          | {
              cursors: Array<{ cursor: number; streamId: string }>;
              kind: "deltas";
            };
        threadId: string;
      },
      {
        continueCursor: string;
        isDone: boolean;
        page: Array<{
          _creationTime: number;
          _id: string;
          agentName?: string;
          embeddingId?: string;
          error?: string;
          fileIds?: Array<string>;
          finishReason?:
            | "stop"
            | "length"
            | "content-filter"
            | "tool-calls"
            | "error"
            | "other"
            | "unknown";
          id?: string;
          message?:
            | {
                content:
                  | string
                  | Array<
                      | {
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          text: string;
                          type: "text";
                        }
                      | {
                          image: string | ArrayBuffer;
                          mimeType?: string;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "image";
                        }
                      | {
                          data: string | ArrayBuffer;
                          filename?: string;
                          mimeType: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "file";
                        }
                    >;
                providerOptions?: Record<string, Record<string, any>>;
                role: "user";
              }
            | {
                content:
                  | string
                  | Array<
                      | {
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          text: string;
                          type: "text";
                        }
                      | {
                          data: string | ArrayBuffer;
                          filename?: string;
                          mimeType: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "file";
                        }
                      | {
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          signature?: string;
                          text: string;
                          type: "reasoning";
                        }
                      | {
                          data: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          type: "redacted-reasoning";
                        }
                      | {
                          args: any;
                          providerExecuted?: boolean;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          toolCallId: string;
                          toolName: string;
                          type: "tool-call";
                        }
                      | {
                          args?: any;
                          experimental_content?: Array<
                            | { text: string; type: "text" }
                            | { data: string; mimeType?: string; type: "image" }
                          >;
                          isError?: boolean;
                          output?:
                            | { type: "text"; value: string }
                            | { type: "json"; value: any }
                            | { type: "error-text"; value: string }
                            | { type: "error-json"; value: any }
                            | {
                                type: "content";
                                value: Array<
                                  | { text: string; type: "text" }
                                  | {
                                      data: string;
                                      mediaType: string;
                                      type: "media";
                                    }
                                >;
                              };
                          providerExecuted?: boolean;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          result?: any;
                          toolCallId: string;
                          toolName: string;
                          type: "tool-result";
                        }
                      | {
                          id: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          sourceType: "url";
                          title?: string;
                          type: "source";
                          url: string;
                        }
                      | {
                          filename?: string;
                          id: string;
                          mediaType: string;
                          providerMetadata?: Record<
                            string,
                            Record<string, any>
                          >;
                          providerOptions?: Record<string, Record<string, any>>;
                          sourceType: "document";
                          title: string;
                          type: "source";
                        }
                    >;
                providerOptions?: Record<string, Record<string, any>>;
                role: "assistant";
              }
            | {
                content: Array<{
                  args?: any;
                  experimental_content?: Array<
                    | { text: string; type: "text" }
                    | { data: string; mimeType?: string; type: "image" }
                  >;
                  isError?: boolean;
                  output?:
                    | { type: "text"; value: string }
                    | { type: "json"; value: any }
                    | { type: "error-text"; value: string }
                    | { type: "error-json"; value: any }
                    | {
                        type: "content";
                        value: Array<
                          | { text: string; type: "text" }
                          | { data: string; mediaType: string; type: "media" }
                        >;
                      };
                  providerExecuted?: boolean;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  result?: any;
                  toolCallId: string;
                  toolName: string;
                  type: "tool-result";
                }>;
                providerOptions?: Record<string, Record<string, any>>;
                role: "tool";
              }
            | {
                content: string;
                providerOptions?: Record<string, Record<string, any>>;
                role: "system";
              };
          model?: string;
          order: number;
          provider?: string;
          providerMetadata?: Record<string, Record<string, any>>;
          providerOptions?: Record<string, Record<string, any>>;
          reasoning?: string;
          reasoningDetails?: Array<
            | {
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                signature?: string;
                text: string;
                type: "reasoning";
              }
            | { signature?: string; text: string; type: "text" }
            | { data: string; type: "redacted" }
          >;
          sources?: Array<
            | {
                id: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                sourceType: "url";
                title?: string;
                type?: "source";
                url: string;
              }
            | {
                filename?: string;
                id: string;
                mediaType: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                sourceType: "document";
                title: string;
                type: "source";
              }
          >;
          status: "pending" | "success" | "failed";
          stepOrder: number;
          text?: string;
          threadId: string;
          tool: boolean;
          usage?: {
            cachedInputTokens?: number;
            completionTokens: number;
            promptTokens: number;
            reasoningTokens?: number;
            totalTokens: number;
          };
          userId?: string;
          warnings?: Array<
            | { details?: string; setting: string; type: "unsupported-setting" }
            | { details?: string; tool: any; type: "unsupported-tool" }
            | { message: string; type: "other" }
          >;
        }>;
        pageStatus?: "SplitRecommended" | "SplitRequired" | null;
        splitCursor?: string | null;
        streams?:
          | {
              kind: "list";
              messages: Array<{
                agentName?: string;
                format?: "UIMessageChunk" | "TextStreamPart";
                model?: string;
                order: number;
                provider?: string;
                providerOptions?: Record<string, Record<string, any>>;
                status: "streaming" | "finished" | "aborted";
                stepOrder: number;
                streamId: string;
                userId?: string;
              }>;
            }
          | {
              deltas: Array<{
                end: number;
                parts: Array<any>;
                start: number;
                streamId: string;
              }>;
              kind: "deltas";
            };
      }
    >;
    listThreads: FunctionReference<
      "query",
      "public",
      {
        apiKey: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        userId?: string;
      },
      {
        continueCursor: string;
        isDone: boolean;
        page: Array<{
          _creationTime: number;
          _id: string;
          lastAgentName?: string;
          lastMessageAt?: number;
          latestMessage?: string;
          status: "active" | "archived";
          summary?: string;
          title?: string;
          userId?: string;
        }>;
        pageStatus?: "SplitRecommended" | "SplitRequired" | null;
        splitCursor?: string | null;
      }
    >;
    listUsers: FunctionReference<
      "query",
      "public",
      {
        apiKey: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      {
        continueCursor: string;
        isDone: boolean;
        page: Array<{ _id: string; name: string }>;
        pageStatus?: "SplitRecommended" | "SplitRequired" | null;
        splitCursor?: string | null;
      }
    >;
  };
};
export type InternalApiType = {};
