// Trend4Media Backstage Backend System
// Einfaches localStorage-basiertes User Management System

class T4MBackend {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('t4m_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('t4m_current_user') || 'null');
        this.initDatabase();
    }

    initDatabase() {
        // Erstelle Demo-Benutzer wenn keine existieren
        if (this.users.length === 0) {
            this.createDemoUsers();
        }
    }

    createDemoUsers() {
        const demoUsers = [
            {
                id: 'creator_1',
                type: 'creator',
                name: 'Max Mustermann',
                email: 'max@example.com',
                password: 'demo123',
                handle: 'maxmustermann',
                category: 'fashion',
                followers: '100k-500k',
                verified: true,
                status: 'active',
                joinDate: '2024-01-15'
            },
            {
                id: 'employee_1',
                type: 'employee',
                name: 'Sarah Schmidt',
                email: 'sarah@trend4media.com',
                password: 'demo123',
                position: 'account-manager',
                department: 'Creator Management',
                status: 'active',
                joinDate: '2023-08-20'
            },
            {
                id: 'brand_1',
                type: 'brand',
                name: 'Nike Deutschland',
                email: 'marketing@nike.de',
                password: 'demo123',
                brandName: 'Nike',
                contactName: 'Lisa Weber',
                website: 'https://nike.com',
                industry: 'fashion',
                collaboration: 'brand-ambassador',
                budget: '25k-50k',
                status: 'active',
                joinDate: '2024-02-10'
            }
        ];

        this.users = demoUsers;
        this.saveUsers();
    }

    saveUsers() {
        localStorage.setItem('t4m_users', JSON.stringify(this.users));
    }

    saveCurrentUser(user) {
        localStorage.setItem('t4m_current_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // User Registration
    registerUser(userData) {
        const userId = userData.type + '_' + Date.now();
        const newUser = {
            id: userId,
            ...userData,
            status: userData.type === 'creator' ? 'pending' : 'active', // Creator müssen verifiziert werden
            joinDate: new Date().toISOString().split('T')[0]
        };

        // Check if email already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('E-Mail bereits registriert');
        }

        // Validate TikTok handle for creators
        if (userData.type === 'creator' && userData.handle) {
            const existingHandle = this.users.find(u => u.handle === userData.handle);
            if (existingHandle) {
                throw new Error('TikTok Handle bereits vergeben');
            }
        }

        this.users.push(newUser);
        this.saveUsers();
        
        return {
            success: true,
            message: userData.type === 'creator' 
                ? 'Registrierung erfolgreich! Ihr Account wird überprüft und freigeschaltet.'
                : 'Registrierung erfolgreich! Sie können sich jetzt einloggen.',
            user: newUser
        };
    }

    // User Login
    loginUser(email, password, userType) {
        const user = this.users.find(u => 
            u.email === email && 
            u.password === password && 
            u.type === userType
        );

        if (!user) {
            throw new Error('Ungültige Anmeldedaten');
        }

        if (user.status === 'pending') {
            throw new Error('Ihr Account wird noch geprüft. Sie erhalten eine E-Mail sobald er freigeschaltet wurde.');
        }

        if (user.status === 'blocked') {
            throw new Error('Ihr Account wurde gesperrt. Bitte kontaktieren Sie den Support.');
        }

        this.saveCurrentUser(user);
        return {
            success: true,
            message: 'Login erfolgreich!',
            user: user
        };
    }

    // Get Dashboard Data
    getDashboardData(userType, userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;

        const baseData = {
            user: user,
            lastLogin: new Date().toLocaleString('de-DE'),
            notifications: []
        };

        switch (userType) {
            case 'creator':
                return {
                    ...baseData,
                    stats: {
                        followers: this.getFollowerCount(user.followers),
                        monthlyEarnings: Math.floor(Math.random() * 50000) + 10000,
                        engagementRate: (Math.random() * 5 + 5).toFixed(1),
                        totalVideos: Math.floor(Math.random() * 200) + 50,
                        totalLikes: Math.floor(Math.random() * 10000000) + 1000000
                    },
                    recentProjects: [
                        { name: 'Nike Air Max Campaign', status: 'active', earnings: '€2,500' },
                        { name: 'Beauty Brand Collab', status: 'completed', earnings: '€1,800' },
                        { name: 'Tech Review Series', status: 'pending', earnings: '€3,200' }
                    ]
                };

            case 'employee':
                return {
                    ...baseData,
                    stats: {
                        managedCreators: Math.floor(Math.random() * 20) + 5,
                        activeCampaigns: Math.floor(Math.random() * 15) + 3,
                        monthlyRevenue: Math.floor(Math.random() * 200000) + 50000,
                        completionRate: (Math.random() * 20 + 80).toFixed(1)
                    },
                    recentTasks: [
                        { task: 'Creator Onboarding - @newcreator', priority: 'high', due: 'Heute' },
                        { task: 'Campaign Review - Nike Collab', priority: 'medium', due: 'Morgen' },
                        { task: 'Monthly Report erstellen', priority: 'low', due: 'Diese Woche' }
                    ]
                };

            case 'brand':
                return {
                    ...baseData,
                    stats: {
                        activeCampaigns: Math.floor(Math.random() * 10) + 2,
                        totalReach: Math.floor(Math.random() * 5000000) + 1000000,
                        engagementRate: (Math.random() * 3 + 4).toFixed(1),
                        roi: (Math.random() * 200 + 150).toFixed(0)
                    },
                    campaigns: [
                        { name: 'Spring Collection 2024', reach: '2.5M', engagement: '7.2%', status: 'active' },
                        { name: 'Influencer Showcase', reach: '1.8M', engagement: '5.9%', status: 'completed' },
                        { name: 'Product Launch', reach: '3.2M', engagement: '8.1%', status: 'planned' }
                    ]
                };

            default:
                return baseData;
        }
    }

    getFollowerCount(range) {
        const ranges = {
            '0-1k': '800',
            '1k-10k': '7.5K',
            '10k-50k': '32K',
            '50k-100k': '78K',
            '100k-500k': '245K',
            '500k-1m': '750K',
            '1m+': '2.1M'
        };
        return ranges[range] || '0';
    }

    // TikTok Handle Verification (Simulated)
    async verifyTikTokHandle(handle) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate verification (90% success rate)
        const isValid = Math.random() > 0.1;
        
        if (isValid) {
            return {
                valid: true,
                followers: Math.floor(Math.random() * 1000000) + 10000,
                verified: Math.random() > 0.7,
                category: ['fashion', 'beauty', 'tech', 'food', 'gaming'][Math.floor(Math.random() * 5)]
            };
        } else {
            throw new Error('TikTok Handle nicht gefunden oder privat');
        }
    }

    // Get all users (admin function)
    getAllUsers() {
        return this.users;
    }

    // Update user status (admin function)
    updateUserStatus(userId, status) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.status = status;
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Logout
    logout() {
        localStorage.removeItem('t4m_current_user');
        this.currentUser = null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// TikTok API Simulation
class TikTokAPI {
    static async authenticateUser() {
        // Simulate TikTok OAuth flow
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate user accepting/rejecting
                const accepted = Math.random() > 0.2; // 80% acceptance rate
                
                if (accepted) {
                    resolve({
                        handle: 'demo_user_' + Math.floor(Math.random() * 1000),
                        followers: Math.floor(Math.random() * 1000000) + 1000,
                        verified: Math.random() > 0.5,
                        bio: 'Content Creator auf TikTok 🎭',
                        profileImage: 'https://via.placeholder.com/150'
                    });
                } else {
                    reject(new Error('TikTok Authentifizierung abgebrochen'));
                }
            }, 2000);
        });
    }
}

// Export for use in main application
window.T4MBackend = T4MBackend;
window.TikTokAPI = TikTokAPI;