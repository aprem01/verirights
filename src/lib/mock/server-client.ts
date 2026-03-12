// Mock Supabase client for server-side (API routes)
// Same chained API but uses the shared store directly

import {
  MOCK_USER,
  insertTrack, getTrack, updateTrack, getTracksByUser,
  insertQuestionnaire, getQuestionnaireByTrack,
  insertScore, getScoreByTrack,
  insertRegistration,
  upsertProfile,
} from "./store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function buildChain(table: string) {
  let _insertData: AnyRecord | null = null;
  let _updateData: AnyRecord | null = null;
  const _eqs: [string, string][] = [];

  function getEq(field: string): string | undefined {
    return _eqs.find(([f]) => f === field)?.[1];
  }

  async function resolve() {
    const eqId = getEq("id");
    const eqTrackId = getEq("track_id");
    const eqUserId = getEq("user_id");

    if (_insertData) {
      switch (table) {
        case "track_analyses":
          return insertTrack(_insertData as Parameters<typeof insertTrack>[0]);
        case "questionnaire_responses":
          return insertQuestionnaire(_insertData as Parameters<typeof insertQuestionnaire>[0]);
        case "human_scores":
          return insertScore(_insertData as Parameters<typeof insertScore>[0]);
        case "registrations":
          return insertRegistration(_insertData as Parameters<typeof insertRegistration>[0]);
        case "profiles":
          return upsertProfile(_insertData as { id: string });
        default:
          return { data: _insertData, error: null };
      }
    }

    if (_updateData) {
      if (table === "track_analyses" && eqId) {
        return updateTrack(eqId, _updateData);
      }
      if (table === "profiles" && eqId) {
        return upsertProfile({ id: eqId, ..._updateData });
      }
      return { data: _updateData, error: null };
    }

    // SELECT
    if (table === "track_analyses") {
      if (eqId) return getTrack(eqId);
      if (eqUserId) return getTracksByUser(eqUserId);
    }
    if (table === "human_scores" && eqTrackId) return getScoreByTrack(eqTrackId);
    if (table === "questionnaire_responses" && eqTrackId) return getQuestionnaireByTrack(eqTrackId);

    return { data: null, error: null };
  }

  const chain = {
    select() { return chain; },
    eq(field: string, value: string) {
      _eqs.push([field, value]);
      return chain;
    },
    order() { return chain; },
    single() { return resolve(); },
    insert(data: AnyRecord) {
      _insertData = data;
      return chain;
    },
    update(data: AnyRecord) {
      _updateData = data;
      return chain;
    },
    upsert(data: AnyRecord) {
      _insertData = data;
      return chain;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    then(onFulfilled?: (val: any) => any, onRejected?: (reason: any) => any) {
      return resolve().then(onFulfilled, onRejected);
    },
  };

  return chain;
}

export function createMockServerClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: MOCK_USER }, error: null }),
      exchangeCodeForSession: async () => ({ error: null }),
    },
    from: (table: string) => buildChain(table),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: "mock/file.cwr" }, error: null }),
        getPublicUrl: (name: string) => ({
          data: { publicUrl: `https://mock-storage.local/${name}` },
        }),
      }),
    },
  };
}
