/**
 * Environment validation for production deployment
 * Run this to verify all required environment variables are set
 */

const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'ADMIN_EMAIL'
];

const optionalEnvVars = [
  'ADDITIONAL_ADMINS',
  'ALLOWED_DOMAINS',
  'RATE_LIMIT_ENABLED',
  'SESSION_TIMEOUT'
];

function validateEnvironment() {
  console.log('🔍 Validating Environment Configuration...\n');
  
  let hasErrors = false;
  
  // Check required variables
  console.log('📋 Required Variables:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: Missing`);
      hasErrors = true;
    } else if (varName === 'NEXTAUTH_SECRET' && value.length < 32) {
      console.log(`⚠️  ${varName}: Too short (should be 32+ characters)`);
      hasErrors = true;
    } else if (varName === 'NEXTAUTH_URL' && value.includes('localhost')) {
      console.log(`⚠️  ${varName}: Still using localhost (update for production)`);
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  });
  
  console.log('\n📋 Optional Variables:');
  optionalEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`⚪ ${varName}: Not set (using defaults)`);
    }
  });
  
  // Security recommendations
  console.log('\n🛡️  Security Recommendations:');
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  NODE_ENV should be "production" for deployment');
  } else {
    console.log('✅ NODE_ENV: production');
  }
  
  if (!process.env.ALLOWED_DOMAINS) {
    console.log('⚠️  Consider setting ALLOWED_DOMAINS for enhanced security');
  } else {
    console.log('✅ Domain restrictions enabled');
  }
  
  if (process.env.RATE_LIMIT_ENABLED !== 'true') {
    console.log('⚠️  Consider enabling rate limiting for production');
  } else {
    console.log('✅ Rate limiting enabled');
  }
  
  // Summary
  console.log('\n📊 Summary:');
  if (hasErrors) {
    console.log('❌ Environment validation failed. Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('✅ Environment validation passed! Ready for deployment.');
  }
  
  console.log('\n🔗 After deployment, your dashboard will be available at:');
  console.log(`   ${process.env.NEXTAUTH_URL || 'https://your-domain.vercel.app'}`);
}

// Run validation
validateEnvironment();
