export const loadAuthoritativeCMSData = async (): Promise<BackupData> => {
  const { db, isFirebaseReady } = await import('./firebase');

  if (!isFirebaseReady || !db) {
    throw new CMSConfigError(
      'Firebase is not configured (missing VITE_FIREBASE_* environment variables).'
    );
  }

  const { doc, getDoc, setDoc } = await import('firebase/firestore');

  const ref = doc(db, CMS_COLLECTION, CMS_DOC_ID);
  const snap = await getDoc(ref);

  // Firestore document already exists
  if (snap.exists()) {
    const cloudData = snap.data() as Partial<BackupData>;
    const defaultData = getInitialBackupData();

    return {
      ...defaultData,
      ...cloudData,

      site: {
        ...defaultData.site,
        ...(cloudData.site || {}),
      },

      hero: {
        ...defaultData.hero,
        ...(cloudData.hero || {}),
      },

      about: {
        ...defaultData.about,
        ...(cloudData.about || {}),
      },

      contactInfo: {
        ...defaultData.contactInfo,
        ...(cloudData.contactInfo || {}),
      },

      services: Array.isArray(cloudData.services)
        ? cloudData.services
        : defaultData.services,

      whyCards: Array.isArray(cloudData.whyCards)
        ? cloudData.whyCards
        : defaultData.whyCards,

      testimonials: Array.isArray(cloudData.testimonials)
        ? cloudData.testimonials
        : defaultData.testimonials,

      zodiac: Array.isArray(cloudData.zodiac)
        ? cloudData.zodiac
        : defaultData.zodiac,

      panchang: cloudData.panchang || defaultData.panchang,

      reports: Array.isArray(cloudData.reports)
        ? cloudData.reports
        : defaultData.reports,

      blog: Array.isArray(cloudData.blog)
        ? cloudData.blog
        : defaultData.blog,

      faqs: Array.isArray(cloudData.faqs)
        ? cloudData.faqs
        : defaultData.faqs,

      theme: {
        ...defaultData.theme,
        ...(cloudData.theme || {}),
      },

      sectionOrders: Array.isArray(cloudData.sectionOrders)
        ? cloudData.sectionOrders
        : defaultData.sectionOrders,

      books: Array.isArray(cloudData.books)
        ? cloudData.books
        : defaultData.books,

      coupons: Array.isArray(cloudData.coupons)
        ? cloudData.coupons
        : defaultData.coupons,

      orders: Array.isArray(cloudData.orders)
        ? cloudData.orders
        : defaultData.orders,

      pageSeo: Array.isArray(cloudData.pageSeo)
        ? cloudData.pageSeo
        : defaultData.pageSeo,

      whatsapp: {
        ...defaultData.whatsapp,
        ...(cloudData.whatsapp || {}),
      },

      googleMaps: {
        ...defaultData.googleMaps,
        ...(cloudData.googleMaps || {}),
      },
    };
  }

  // First-time setup:
  // Create the CMS document in Firestore only if it does not exist.
  const defaultData = getInitialBackupData();

  await setDoc(ref, defaultData);

  return defaultData;
};
export const getLeads = async () => {
  return [];
};

export const saveLeads = async (_leads: unknown[]) => {
  return true;
};

export const logActivity = async (
  _activity: unknown
) => {
  return true;
};export const getLeads = async () => {
  return [];
};

export const saveLeads = async (_leads: unknown[]) => {
  return true;
};

export const logActivity = async (_activity: unknown) => {
  return true;
};
