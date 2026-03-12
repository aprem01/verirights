// Mock Supabase client for browser-side usage
// Mimics the chained query API: supabase.from("table").select().eq().single()

import {
  MOCK_USER, MOCK_USER_ID,
  getProfile, upsertProfile,
  insertTrack, getTrack, updateTrack, getTracksByUser,
  insertQuestionnaire, getQuestionnaireByTrack,
  getScoreByTrack,
} from "./store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

function createQueryChain(table: string) {
  let _insertData: AnyData = null;
  let _updateData: AnyData = null;
  let _upsertData: AnyData = null;
  let _selectFields = "*";
  const _eqs: [string, string][] = [];

  function getEq(field: string): string | undefined {
    return _eqs.find(([f]) => f === field)?.[1];
  }

  function execute(): { data: AnyData; error: AnyData } {
    // INSERT
    if (_insertData) {
      switch (table) {
        case "track_analyses":
          return insertTrack(_insertData);
        case "questionnaire_responses":
          return insertQuestionnaire(_insertData);
        case "profiles":
          return upsertProfile(_insertData);
        default:
          return { data: _insertData, error: null };
      }
    }

    // UPSERT
    if (_upsertData) {
      if (table === "profiles") {
        return upsertProfile(_upsertData as { id: string });
      }
      return { data: _upsertData, error: null };
    }

    // UPDATE
    if (_updateData) {
      const eqId = getEq("id");
      if (table === "track_analyses" && eqId) {
        return updateTrack(eqId, _updateData);
      }
      return { data: _updateData, error: null };
    }

    // SELECT
    const eqId = getEq("id");
    const eqTrackId = getEq("track_id");
    const eqUserId = getEq("user_id");

    if (table === "track_analyses") {
      if (_selectFields.includes("human_scores") && eqUserId) {
        return getTracksByUser(eqUserId);
      }
      if (eqId) return getTrack(eqId);
    }
    if (table === "human_scores" && eqTrackId) {
      return getScoreByTrack(eqTrackId);
    }
    if (table === "questionnaire_responses" && eqTrackId) {
      return getQuestionnaireByTrack(eqTrackId);
    }
    if (table === "profiles" && eqId) {
      return getProfile(eqId);
    }

    return { data: null, error: null };
  }

  const chain = {
    insert(data: AnyData) {
      _insertData = data;
      return chain;
    },
    upsert(data: AnyData) {
      _upsertData = data;
      return chain;
    },
    update(data: AnyData) {
      _updateData = data;
      return chain;
    },
    select(fields?: string) {
      if (fields) _selectFields = fields;
      return chain;
    },
    eq(field: string, value: string) {
      _eqs.push([field, value]);
      return chain;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    order(_field: string, _opts?: { ascending: boolean }) {
      return chain;
    },
    single(): Promise<{ data: AnyData; error: AnyData }> {
      return Promise.resolve(execute());
    },
    then(
      onFulfilled?: (value: { data: AnyData; error: AnyData }) => AnyData,
      onRejected?: (reason: AnyData) => AnyData
    ) {
      return Promise.resolve(execute()).then(onFulfilled, onRejected);
    },
  };

  return chain;
}

type AuthCallback = (event: string, session: AnyData) => void;

export function createMockClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: MOCK_USER }, error: null }),
      signInWithPassword: async () => ({ data: { user: MOCK_USER }, error: null }),
      signUp: async () => ({ data: { user: MOCK_USER }, error: null }),
      signInWithOAuth: async () => ({ data: {}, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: AuthCallback) => {
        setTimeout(() => callback("SIGNED_IN", { user: MOCK_USER }), 0);
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
    },
    from: (table: string) => createQueryChain(table),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: "mock/file.mp3" }, error: null }),
        getPublicUrl: (name: string) => ({
          data: { publicUrl: `https://mock-storage.local/${name}` },
        }),
      }),
    },
  };
}

// Type-compatible mock user for the navbar (matches Supabase User shape)
export const MOCK_SUPABASE_USER = {
  id: MOCK_USER_ID,
  email: "demo@verirights.com",
  app_metadata: {},
  user_metadata: { account_type: "independent", artist_name: "Demo Artist" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};
