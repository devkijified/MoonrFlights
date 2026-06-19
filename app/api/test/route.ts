import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test endpoint called');
    
    const supabase = await createClient();
    
    // Test 1: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return NextResponse.json({ 
        success: false,
        test: 'auth',
        error: authError.message 
      }, { status: 401 });
    }
    
    // Test 2: Check database connection
    const { data: tables, error: dbError } = await supabase
      .from('flights')
      .select('count', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      user: user ? { id: user.id, email: user.email } : null,
      database: {
        connected: !dbError,
        flightCount: tables?.count || 0,
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
