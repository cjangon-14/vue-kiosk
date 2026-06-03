// Mock database - works everywhere (dev, staging, production on Vercel)
export const mockData = {
  stores: [
    {
      id: "1",
      name: "McDonalds",
      kiosksCount: 5,
      adminsCount: 3,
      status: "active",
      lastActivity: "2026-04-13T02:19:20.684Z"
    },
    {
      id: "2",
      name: "Jollibee",
      kiosksCount: 8,
      adminsCount: 4,
      status: "active",
      lastActivity: "2026-04-13T03:33:55.612Z"
    },
    {
      id: "3",
      name: "Airport Terminal",
      kiosksCount: 12,
      adminsCount: 6,
      status: "active",
      lastActivity: "2025-12-10T03:09:36.390Z"
    },
    {
      id: "4",
      name: "Shopping Center",
      kiosksCount: 6,
      adminsCount: 2,
      status: "active",
      lastActivity: "2026-01-10T03:09:36.390Z"
    },
    {
      id: "5",
      name: "Train Station",
      kiosksCount: 4,
      adminsCount: 2,
      status: "active",
      lastActivity: "2026-04-13T02:15:32.605Z"
    },
    {
      id: "1_zDA53RYEU",
      name: "test",
      status: "active",
      kiosksCount: 0,
      adminsCount: 0,
      lastActivity: "2026-04-20T15:05:24.923Z"
    },
    {
      id: "BQ-n_2nFSc4",
      name: "test",
      status: "active",
      kiosksCount: 0,
      adminsCount: 0,
      lastActivity: "2026-04-20T12:52:50.372Z"
    }
  ],

  admins: {
    "1": [
      {
        id: "1",
        username: "john1",
        firstName: "John1",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "Admin",
        darkMode: false
      },
      {
        id: "2",
        username: "jane",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: "password123",
        role: "Admin",
        darkMode: false
      },
      {
        id: "3",
        username: "bob",
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob.johnson@example.com",
        password: "password123",
        role: "Admin",
        darkMode: false
      },
      {
        id: "1775628893250",
        username: "user111",
        firstName: "111",
        lastName: "11",
        email: "asd@g.c",
        password: "password123",
        role: "Admin"
      },
      {
        id: "1775629322221",
        username: "testuser1",
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "1775629357148",
        username: "rtew",
        firstName: "rtew",
        lastName: "test",
        email: "teeest@gmail.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "1775802001313",
        username: "johnm",
        firstName: "john",
        lastName: "milagros",
        email: "test@g.com",
        password: "password123",
        role: "Admin"
      }
    ],
    "2": [
      {
        id: "4",
        username: "alice",
        firstName: "Alice",
        lastName: "Williams",
        email: "alice.w@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "5",
        username: "charlie",
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie.b@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "6",
        username: "diana",
        firstName: "Diana",
        lastName: "Davis",
        email: "diana.d@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "7",
        username: "eve",
        firstName: "Eve",
        lastName: "Miller",
        email: "eve.m@example.com",
        password: "password123",
        role: "Admin"
      }
    ],
    "3": [
      {
        id: "8",
        username: "frank",
        firstName: "Frank",
        lastName: "Wilson",
        email: "frank.w@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "9",
        username: "grace",
        firstName: "Grace",
        lastName: "Taylor",
        email: "grace.t@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "10",
        username: "henry",
        firstName: "Henry",
        lastName: "Anderson",
        email: "henry.a@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "11",
        username: "ivy",
        firstName: "Ivy",
        lastName: "Thomas",
        email: "ivy.t@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "12",
        username: "jack",
        firstName: "Jack",
        lastName: "Moore",
        email: "jack.m@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "13",
        username: "kate",
        firstName: "Kate",
        lastName: "Martin",
        email: "kate.m@example.com",
        password: "password123",
        role: "Admin"
      }
    ],
    "4": [
      {
        id: "14",
        username: "leo",
        firstName: "Leo",
        lastName: "Garcia",
        email: "leo.g@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "15",
        username: "mia",
        firstName: "Mia",
        lastName: "Rodriguez",
        email: "mia.r@example.com",
        password: "password123",
        role: "Admin"
      }
    ],
    "5": [
      {
        id: "16",
        username: "noah",
        firstName: "Noah",
        lastName: "Martinez",
        email: "noah.m@example.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: "17",
        username: "olivia",
        firstName: "Olivia",
        lastName: "Hernandez",
        email: "olivia.h@example.com",
        password: "password123",
        role: "Admin"
      }
    ],
    "VxVIMmgagYQ": [
      {
        id: "1775632680894",
        username: "testuser2",
        firstName: "test",
        lastName: "test",
        email: "test@gmail.com",
        password: "password123",
        role: "Admin"
      }
    ],
    "RZ8WN81SM1Q": [
      {
        id: "1775803474935",
        username: "johnny1",
        firstName: "johnny1",
        lastName: "doey",
        email: "jd@g.com",
        password: "password123",
        role: "Admin"
      }
    ],
    "1_zDA53RYEU": [
      {
        id: "1776697524914",
        username: "test1",
        firstName: "Test",
        lastName: "Test",
        email: "test@gmail.com",
        password: "password123",
        role: "Admin"
      }
    ]
  },

  superadmin: {
    id: "1",
    username: "admin",
    firstName: "System",
    lastName: "Admin",
    email: "superadmin@example.com",
    password: "password123",
    role: "Super Admin",
    darkMode: false
  },

  kiosks: {
    "1": [
      {
        id: "2",
        kioskNumber: "K-002",
        status: "active",
        lastUpdated: "2026-04-14T01:56:15.246Z",
        location: "Main Entrance"
      },
      {
        id: "3",
        kioskNumber: "K-003",
        status: "active",
        lastUpdated: "2026-04-13T08:54:01.866Z",
        location: ""
      },
      {
        id: "4",
        kioskNumber: "K-004",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "5",
        kioskNumber: "K-005",
        status: "maintenance",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "1775629180518",
        kioskNumber: "k-987",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "1775800447873",
        kioskNumber: "k-999",
        status: "active",
        lastUpdated: "2026-04-10T05:54:07.873Z"
      },
      {
        id: "1775800751823",
        kioskNumber: "k-998",
        status: "active",
        lastUpdated: "2026-04-10T05:59:11.823Z"
      }
    ],
    "2": [
      {
        id: "6",
        kioskNumber: "K-006",
        status: "offline",
        lastUpdated: "2026-04-13T09:03:15.604Z",
        location: ""
      },
      {
        id: "7",
        kioskNumber: "K-007",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "8",
        kioskNumber: "K-008",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "9",
        kioskNumber: "K-009",
        status: "offline",
        lastUpdated: "2026-04-13T09:07:44.562Z",
        location: ""
      },
      {
        id: "10",
        kioskNumber: "K-010",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "11",
        kioskNumber: "K-011",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "12",
        kioskNumber: "K-012",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "13",
        kioskNumber: "K-013",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      }
    ],
    "3": [
      {
        id: "14",
        kioskNumber: "K-014",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "15",
        kioskNumber: "K-015",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "16",
        kioskNumber: "K-016",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "17",
        kioskNumber: "K-017",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "18",
        kioskNumber: "K-018",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "19",
        kioskNumber: "K-019",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "20",
        kioskNumber: "K-020",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "21",
        kioskNumber: "K-021",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "22",
        kioskNumber: "K-022",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "23",
        kioskNumber: "K-023",
        status: "maintenance",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "24",
        kioskNumber: "K-024",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "25",
        kioskNumber: "K-025",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      }
    ],
    "4": [
      {
        id: "26",
        kioskNumber: "K-026",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "27",
        kioskNumber: "K-027",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "28",
        kioskNumber: "K-028",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "29",
        kioskNumber: "K-029",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "30",
        kioskNumber: "K-030",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "31",
        kioskNumber: "K-031",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      }
    ],
    "5": [
      {
        id: "32",
        kioskNumber: "K-032",
        status: "offline",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "33",
        kioskNumber: "K-033",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "34",
        kioskNumber: "K-034",
        status: "maintenance",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      },
      {
        id: "35",
        kioskNumber: "K-035",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      }
    ],
    "VxVIMmgagYQ": [
      {
        id: "1775632688461",
        kioskNumber: "k-001",
        status: "active",
        lastUpdated: "2026-04-10T03:09:36.390Z"
      }
    ],
    "RZ8WN81SM1Q": [
      {
        id: "1776046584143",
        kioskNumber: "k-55",
        status: "active",
        lastUpdated: "2026-04-13T02:16:24.143Z"
      }
    ]
  },

  recentActivities: [
    {
      id: "1",
      type: "Kiosk Added",
      description: "New kiosk K-035 added to Train Station",
      timestamp: "2026-04-10T03:09:36.390Z"
    },
    {
      id: "2",
      type: "Admin Created",
      description: "Kate Martin added to Airport Terminal",
      timestamp: "2026-04-10T03:09:36.390Z"
    },
    {
      id: "3",
      type: "Status Change",
      description: "K-020 status changed to Offline",
      timestamp: "2026-04-10T03:09:36.390Z"
    },
    {
      id: "4",
      type: "Store Created",
      description: "New store \"Train Station\" created",
      timestamp: "2026-04-10T03:09:36.390Z"
    },
    {
      id: "5",
      type: "Kiosk Maintenance",
      description: "K-023 scheduled for maintenance",
      timestamp: "2026-04-10T03:09:36.390Z"
    },
    {
      id: "6",
      type: "Admin Created",
      description: "John Doe added as admin to Airport Terminal",
      timestamp: "2026-04-10T03:09:36.390Z"
    },
    {
      id: "Gz9jtewlbKk",
      type: "Login",
      description: "User \"admin\" logged in",
      timestamp: "2026-04-21T02:36:45.586Z"
    }
  ],

  categories: [
    {
      id: "cat-001",
      storeId: "1",
      name: "Burgers",
      description: "Delicious beef and chicken burgers",
      image: "https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/legacy/webp/burger-with-melted-cheese-m-Y1i3jpYYJZYfOEfX5dX.webp",
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "cat-002",
      storeId: "1",
      name: "Drinks",
      description: "Soft drinks, juices, and beverages",
      image: "https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/legacy/webp/colorful-cocktails-3Uqu14eVUQco20F3FsaUP.webp",
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "cat-003",
      storeId: "1",
      name: "Sides",
      description: "Fries, salads, and other sides",
      image: "https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/legacy/webp/small-vegetable-side-salad-MK5YNuWMQL-IQ5IaVtMPH.webp",
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      name: "Burgers",
      description: "",
      image: "",
      storeId: "2",
      id: "euLUV2WQAHc",
      createdAt: "2026-04-13T07:52:31.235Z"
    },
    {
      name: "test",
      description: "",
      image: "",
      storeId: "1",
      id: "p_9sc3uyab0",
      createdAt: "2026-04-13T08:53:24.530Z"
    },
    {
      name: "Rice Meals",
      description: "",
      image: "",
      storeId: "2",
      id: "kI3Fi2cyawQ",
      createdAt: "2026-04-13T09:02:26.349Z"
    }
  ],

  products: [
    {
      id: "prod-001",
      storeId: "1",
      name: "Big Mac",
      category: "Burgers",
      price: 9.99,
      description: "Double beef patty with special sauce",
      image: "https://via.placeholder.com/300?text=Big+Mac",
      isAvailable: true,
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "prod-002",
      storeId: "1",
      name: "Quarter Pounder",
      category: "Burgers",
      price: 8.99,
      description: "Quarter pound fresh beef patty",
      image: "https://via.placeholder.com/300?text=Quarter+Pounder",
      isAvailable: true,
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "prod-003",
      storeId: "1",
      name: "Coca Cola",
      category: "Drinks",
      price: 2.99,
      description: "Cold refreshing cola",
      image: "https://via.placeholder.com/300?text=Coca+Cola",
      isAvailable: true,
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "prod-004",
      storeId: "1",
      name: "French Fries",
      category: "Sides",
      price: 3.49,
      description: "Hot and crispy golden fries",
      image: "https://via.placeholder.com/300?text=French+Fries",
      isAvailable: true,
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      name: "test",
      category: "test",
      price: 998.99,
      description: "test",
      image: "",
      isAvailable: true,
      storeId: "1",
      id: "iBhZUPIw3UM",
      createdAt: "2026-04-13T08:53:38.498Z"
    },
    {
      name: "Chicken",
      category: "Rice Meals",
      price: 12.54,
      description: "",
      image: "",
      isAvailable: true,
      storeId: "2",
      id: "SkZ4R_4m6tA",
      createdAt: "2026-04-13T09:02:42.821Z"
    }
  ],

  menus: [
    {
      id: "menu-001",
      storeId: "1",
      name: "Classic Burger Combo",
      description: "Big Mac with fries and drink",
      price: 14.99,
      items: [
        "Big Mac",
        "French Fries",
        "Coca Cola"
      ],
      isActive: true,
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "menu-002",
      storeId: "1",
      name: "Value Menu",
      description: "Budget-friendly combo",
      price: 11.99,
      items: [
        "Quarter Pounder",
        "French Fries"
      ],
      isActive: true,
      createdAt: "2026-04-13T00:00:00.000Z"
    },
    {
      name: "test",
      description: "test",
      price: 998.99,
      items: [],
      isActive: true,
      storeId: "1",
      id: "hSmmF4udHSc",
      createdAt: "2026-04-13T08:53:47.995Z"
    },
    {
      name: "Combo Meal A1",
      description: "",
      price: 18.99,
      items: [],
      isActive: true,
      storeId: "2",
      id: "xXkeyc91-hE",
      createdAt: "2026-04-13T09:02:58.509Z"
    }
  ],

  inventory: [
    {
      id: "inv-001",
      storeId: "1",
      productId: "prod-001",
      quantity: 45,
      minThreshold: 10,
      maxCapacity: 100,
      updatedAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "inv-002",
      storeId: "1",
      productId: "prod-002",
      quantity: 80,
      minThreshold: 10,
      maxCapacity: 80,
      updatedAt: "2026-04-14T02:27:06.214Z"
    },
    {
      id: "inv-003",
      storeId: "1",
      productId: "prod-003",
      quantity: 120,
      minThreshold: 50,
      maxCapacity: 200,
      updatedAt: "2026-04-13T00:00:00.000Z"
    },
    {
      id: "inv-004",
      storeId: "1",
      productId: "prod-004",
      quantity: 8,
      minThreshold: 10,
      maxCapacity: 60,
      updatedAt: "2026-04-13T00:00:00.000Z"
    }
  ],

  staff: [
    {
      id: "i36qaClhcZo",
      storeId: "1",
      status: "active",
      firstName: "Chris John",
      lastName: "Angon",
      email: "angon.chrisjohn014@gmail.com",
      phone: "63-966-987-1365",
      position: "Cashier",
      createdAt: "2026-04-20T13:56:41.506Z"
    },
    {
      id: "bEIsG96EyZk",
      storeId: "1",
      status: "active",
      firstName: "test",
      lastName: "test",
      email: "test@g.com",
      phone: "63-123-123-1234",
      position: "Manager",
      createdAt: "2026-04-20T14:57:40.098Z"
    },
    {
      id: "KySqQgkEQgw",
      storeId: "1_zDA53RYEU",
      status: "active",
      firstName: "test",
      lastName: "test",
      email: "test@g.com",
      phone: "63-123-123-1234",
      position: "Manager",
      createdAt: "2026-04-20T15:07:38.637Z"
    }
  ],

  staffActivityLogs: [
    {
      id: "mJOwH1rEiDw",
      storeId: "1",
      staffId: null,
      type: "Staff Added",
      description: "Chris John Angon added to staff",
      timestamp: "2026-04-20T13:56:41.524Z"
    },
    {
      id: "PgVOxaDkaqg",
      storeId: "1",
      staffId: null,
      type: "Staff Added",
      description: "test test added to staff",
      timestamp: "2026-04-20T14:57:40.115Z"
    },
    {
      id: "CaRV-b3ws1M",
      storeId: "1_zDA53RYEU",
      staffId: null,
      type: "Staff Added",
      description: "test test added to staff",
      timestamp: "2026-04-20T15:07:38.653Z"
    },
    {
      id: "PlC93sW8a48",
      storeId: "1_zDA53RYEU",
      staffId: null,
      type: "Staff Updated",
      description: "test test profile updated",
      timestamp: "2026-04-20T15:07:45.332Z"
    },
    {
      id: "d6qRF1HBm5k",
      storeId: "1",
      staffId: null,
      type: "Logout",
      description: "User \"john1\" logged out",
      timestamp: "2026-04-21T02:24:05.097Z"
    },
    {
      id: "2qvRFIE43rw",
      storeId: "1",
      staffId: null,
      type: "Login",
      description: "User \"john1\" logged in",
      timestamp: "2026-04-21T02:24:12.019Z"
    },
    {
      id: "jOxUBbR4PtY",
      storeId: "1",
      staffId: null,
      type: "Logout",
      description: "User \"john1\" logged out",
      timestamp: "2026-04-21T02:42:28.854Z"
    }
  ]
};
