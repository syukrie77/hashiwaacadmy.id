export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    role: 'admin' | 'student' | 'instructor'
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    role: 'admin' | 'student' | 'instructor'
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    role?: 'admin' | 'student' | 'instructor'
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    user_id: string
                    avatar: string | null
                    phone: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    avatar?: string | null
                    phone?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    avatar?: string | null
                    phone?: string | null
                }
            }
            classes: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    price: number | null
                    is_active: boolean | null
                    owner_id: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    price?: number | null
                    is_active?: boolean | null
                    owner_id?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    price?: number | null
                    is_active?: boolean | null
                    owner_id?: string | null
                }
            }
            enrollments: {
                Row: {
                    id: string
                    user_id: string
                    class_id: string
                    status: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    class_id: string
                    status?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    class_id?: string
                    status?: string | null
                    created_at?: string
                }
            }
            modules: {
                Row: {
                    id: string
                    class_id: string
                    title: string
                    order_no: number | null
                }
                Insert: {
                    id?: string
                    class_id: string
                    title: string
                    order_no?: number | null
                }
                Update: {
                    id?: string
                    class_id?: string
                    title?: string
                    order_no?: number | null
                }
            }
            materials: {
                Row: {
                    id: string
                    module_id: string
                    title: string
                    type: string
                    content: string | null
                    duration: number | null
                }
                Insert: {
                    id?: string
                    module_id: string
                    title: string
                    type: string
                    content?: string | null
                    duration?: number | null
                }
                Update: {
                    id?: string
                    module_id?: string
                    title?: string
                    type?: string
                    content?: string | null
                    duration?: number | null
                }
            }
            progress: {
                Row: {
                    id: string
                    user_id: string
                    material_id: string
                    completed: boolean | null
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    material_id: string
                    completed?: boolean | null
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    material_id?: string
                    completed?: boolean | null
                    completed_at?: string | null
                }
            }
            assignments: {
                Row: {
                    id: string
                    class_id: string
                    title: string
                    description: string | null
                    deadline: string | null
                }
                Insert: {
                    id?: string
                    class_id: string
                    title: string
                    description?: string | null
                    deadline?: string | null
                }
                Update: {
                    id?: string
                    class_id?: string
                    title?: string
                    description?: string | null
                    deadline?: string | null
                }
            }
            submissions: {
                Row: {
                    id: string
                    assignment_id: string
                    user_id: string
                    file_url: string | null
                    score: number | null
                }
                Insert: {
                    id?: string
                    assignment_id: string
                    user_id: string
                    file_url?: string | null
                    score?: number | null
                }
                Update: {
                    id?: string
                    assignment_id?: string
                    user_id?: string
                    file_url?: string | null
                    score?: number | null
                }
            }
            exams: {
                Row: {
                    id: string
                    class_id: string
                    title: string
                    duration: number | null
                }
                Insert: {
                    id?: string
                    class_id: string
                    title: string
                    duration?: number | null
                }
                Update: {
                    id?: string
                    class_id?: string
                    title?: string
                    duration?: number | null
                }
            }
            questions: {
                Row: {
                    id: string
                    exam_id: string
                    question: string
                    correct_answer: string
                }
                Insert: {
                    id?: string
                    exam_id: string
                    question: string
                    correct_answer: string
                }
                Update: {
                    id?: string
                    exam_id?: string
                    question?: string
                    correct_answer?: string
                }
            }
            results: {
                Row: {
                    id: string
                    exam_id: string
                    user_id: string
                    score: number | null
                }
                Insert: {
                    id?: string
                    exam_id: string
                    user_id: string
                    score?: number | null
                }
                Update: {
                    id?: string
                    exam_id?: string
                    user_id?: string
                    score?: number | null
                }
            }
            payments: {
                Row: {
                    id: string
                    user_id: string
                    class_id: string | null
                    amount: number
                    status: string
                    paid_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    class_id?: string | null
                    amount: number
                    status: string
                    paid_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    class_id?: string | null
                    amount?: number
                    status?: string
                    paid_at?: string | null
                }
            }
            certificates: {
                Row: {
                    id: string
                    user_id: string
                    class_id: string
                    file_url: string | null
                    issued_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    class_id: string
                    file_url?: string | null
                    issued_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    class_id?: string
                    file_url?: string | null
                    issued_at?: string
                }
            }
        }
    }
}
