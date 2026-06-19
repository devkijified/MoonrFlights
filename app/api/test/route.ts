import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test endpoint called');
    
    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceRoleKeyValue: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    
    console.log('📦 Environment check:', envCheck);
    
    const supabase = await createClient();
    
    // Test 1: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return NextResponse.json({ 
        success: false,
        test: 'auth',
        error: authError.message,
        env: envCheck
      }, { status: 401 });
    }
    
    // Test 2: Check database connection - try a simple query
    const { data: tables, error: dbError } = await supabase
      .from('flights')
      .select('count', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      user: user ? { id: user.id, email: user.email } : null,
      database: {
        connected: !dbError,
        flightCount: tables?.count || 0,
        dbError: dbError?.message || null
      },
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
