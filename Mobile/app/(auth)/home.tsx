// app/(auth)/home.tsx
import React from 'react';
import { View, ScrollView, ImageBackground, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Store, ArrowRight, UserPlus, TrendingUp, Home, Settings, LogIn } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

// 🌟 Using your strict required shared common atoms
import { ProductCard } from '@/components/common/ProductCard';
import { CustomButton } from '@/components/common/CustomButton';

export default function PublicMarketplaceHomeScreen() {
  const router = useRouter();

  // Production-ready data matrix mapping cleanly into your ProductCard component format
  const featuredJarsList = [
    {
      id: 'jar-1',
      title: 'Dark Roasted Crunchy',
      makerName: 'Alemayehu Naturals',
      price: 350, // Pure number match
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiDzpRGKqP45V8e9zYa8x-KOuU60egU9qHZk-xlDGzcB_VlVtnNUox0heLB3eo4MIIbgJKziG_dKq5jf9w3a-qdXICn_d4fFrbcbOyODrbKj1oCO7JHzS73GRMHc2bVEKX0k6frZQiitJSnKmT_1fX3HZ6gRhws5yFh0fHAK3jPPBonVVUSS_BHSOPctn1iAbovfuR4ugfMj9anoq_h6mTbYo2lP3eFCr0tjkiRkrUKGLiMzWU_rPE-Jnmfx7CSbyYBTitZk8_9eon',
      discountTag: 'New'
    },
    {
      id: 'jar-2',
      title: 'Silky Smooth Blend',
      makerName: 'Shewa Organics',
      price: 380, // Pure number match
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu9fczg-YsNKfzALvFi_yh4YoDpZvRR8tO_juW537sZvWSQFy1hhXqJYbhPKBbpUL1G2P0ajFX1tLB6GGAHdTtZH4yijDOX04z5XnkIOgpnLkX4Pc_vv9ePz9oQ4kvUytAMsyA4eTwxCoXI_y8KXeTWmWN5j7_I5hhlTsPCFdfFeaNE-Dqa9O5_VeAOn0Ft9fM-ApLZVmxdXkpnVzIsvqpcUNlzbb_geVNEIiRwNDSNGP0xDSVprskIhl2h9snmM9ITNLo12mFhHby',
      discountTag: undefined
    },
    {
      id: 'jar-3',
      title: 'Silky Smooth Blend',
      makerName: 'Shewa Organics',
      price: 380, // Pure number match
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu9fczg-YsNKfzALvFi_yh4YoDpZvRR8tO_juW537sZvWSQFy1hhXqJYbhPKBbpUL1G2P0ajFX1tLB6GGAHdTtZH4yijDOX04z5XnkIOgpnLkX4Pc_vv9ePz9oQ4kvUytAMsyA4eTwxCoXI_y8KXeTWmWN5j7_I5hhlTsPCFdfFeaNE-Dqa9O5_VeAOn0Ft9fM-ApLZVmxdXkpnVzIsvqpcUNlzbb_geVNEIiRwNDSNGP0xDSVprskIhl2h9snmM9ITNLo12mFhHby',
      discountTag: undefined
    },
    {
      id: 'jar-4',
      title: 'Silky Smooth Blend',
      makerName: 'Shewa Organics',
      price: 380, // Pure number match
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu9fczg-YsNKfzALvFi_yh4YoDpZvRR8tO_juW537sZvWSQFy1hhXqJYbhPKBbpUL1G2P0ajFX1tLB6GGAHdTtZH4yijDOX04z5XnkIOgpnLkX4Pc_vv9ePz9oQ4kvUytAMsyA4eTwxCoXI_y8KXeTWmWN5j7_I5hhlTsPCFdfFeaNE-Dqa9O5_VeAOn0Ft9fM-ApLZVmxdXkpnVzIsvqpcUNlzbb_geVNEIiRwNDSNGP0xDSVprskIhl2h9snmM9ITNLo12mFhHby',
      discountTag: undefined
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-background">
      {/* 1. App Bar Header */}
      <View className="bg-card/95 border-b border-border/60 flex-row justify-center items-center px-6 h-14">
        <View className="flex-row items-center gap-2">
          <Store size={22} className="text-peanut-orange" />
          <Text className="text-peanut-orange font-black text-xl tracking-tight">
            NuttyArtisans
          </Text>
        </View>
      </View>

      {/* Core Scroll View Body Container */}
      <ScrollView 
        bounces={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* 2. Hero Image Section Banner */}
        <View className="w-full h-[400px] justify-end relative overflow-hidden">
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUFbxoek-3TuGjasve9jcE33rmOa4V5eRDl7SLW8tF4889pOI29Bh1aZgbY5ZVVc6s_8KTay9sVoyOT4gLUns7NUtiMtrNI3G2zEYumKLpoG7sLgbLhGqPXQ3kVXNEMaqh02i7y-j1k0arKMdtoIBL_I3pHWUjJNJG2Lp-H4qIST0SxRGKQNqPTUSEEFJU8RyN6J4rAeI7P7rWnj-1EpvhntW_S2mNdm3Wmq24oJrsHOa2BVaxaeWk8IfJ-9hn8ZYrsrQB3eUyxREy' }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-deep-earth/95 via-deep-earth/50 to-transparent" />
          
          <View className="p-6 pb-8 z-10 items-center text-center">
            <Text className="text-white text-3xl font-black text-center leading-tight mb-3 drop-shadow-md">
              Artisanal Peanut Butter, Shared Savings.
            </Text>
            <Text className="text-foreground-fixed-dim/90 text-base text-center font-normal leading-relaxed mb-6 max-w-[340px]">
              Join your neighborhood to unlock exclusive prices on Ethiopia's finest small-batch jars.
            </Text>
            
            {/* Reusing CustomButton Atom Molecule */}
            <CustomButton 
              label="Get Started" 
              onPress={() => router.push('/(auth)/sign-up')}
              rightIcon={<ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />}
            />
          </View>
        </View>

        {/* 3. Marketplace Carousel Section */}
        <View className="py-8 bg-background">
          <View className="px-6 mb-4 flex-row justify-between items-end">
            <View>
              <Text className="text-2xl font-black tracking-tight text-foreground">
                Featured Jars
              </Text>
              <Text className="text-sm text-foreground mt-0.5">
                Discover small-batch favorites.
              </Text>
            </View>
            <Pressable onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-sm text-foreground font-bold underline">
                View All
              </Text>
            </Pressable>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            // This applies padding to the edges and perfectly controls the gap between items
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            decelerationRate="fast"
          >
            {featuredJarsList.map((jar) => (
              <ProductCard 
                key={jar.id}
                imageUri={jar.imageUrl}
                name={jar.title}
                price={jar.price}
                sellerName={jar.makerName}
                discount={jar.discountTag}
                isLiked={false}
                onCardPress={() => router.push('/(auth)/sign-up')}
                onAddPress={() => router.push('/(auth)/sign-up')}
                onLikePress={() => router.push('/(auth)/sign-up')}
              />
            ))}
          </ScrollView>

        </View>

        {/* 4. Group Buying Explainer Component Matrix */}
        <View className="bg-surface-container-low rounded-3xl mx-6 p-6 mb-8 gap-6">
          <View className="items-center mb-2">
            <Text className="text-xl font-extrabold text-foreground text-center">
              How Group Buying Works
            </Text>
            <Text className="text-sm text-foreground text-center mt-1">
              Power in numbers for better prices.
            </Text>
          </View>

          <View className="gap-5">
            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-full bg-primary-container/20 items-center justify-center shrink-0">
                <UserPlus size={20} className="text-foreground" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">1. Join a Group Buy</Text>
                <Text className="text-sm text-foreground mt-1">Commit to a local artisan's batch alongside your neighbors.</Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-full bg-primary-container/20 items-center justify-center shrink-0">
                <TrendingUp size={20} className="text-foreground" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">2. Reach the Goal</Text>
                <Text className="text-sm text-foreground mt-1">Once the order minimum is met, the artisan starts crafting.</Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-full bg-primary-container/20 items-center justify-center shrink-0">
                <Text className="text-foreground text-base font-black">🇪🇹</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">3. Everyone Saves</Text>
                <Text className="text-sm text-foreground mt-1">Enjoy premium quality at wholesale prices.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Create Free Account Callout Block */}
        <View className="py-8 px-6 bg-surface-variant text-center border-y border-border items-center">
          <Text className="text-xl font-black text-center text-foreground mb-4">
            Join 5,000+ neighbors supporting local makers.
          </Text>
          
          <View className="w-full max-w-[320px]">
            <CustomButton 
              label="Create Free Account" 
              onPress={() => router.push('/(auth)/sign-up')} 
            />
          </View>
          <Text className="text-xs text-foreground uppercase tracking-wider text-center mt-3">
            No credit card required
          </Text>
        </View>
      </ScrollView>

      {/* 7. Persistent Fixed Unauthenticated Bottom Navigation Bar */}
      <View className="absolute bottom-8 left-0 right-0 h-[76px] bg-card border-t border-border/80 flex-row justify-around items-center px-4 pb-2">
        <Pressable className="flex-col items-center gap-1 min-w-[60px]" onPress={() => router.push('/(auth)/home')}>
          <Home size={22} className="text-peanut-orange" />
          <Text className="text-[10px] font-bold text-peanut-orange">Home</Text>
        </Pressable>

        <Pressable className="flex-col items-center gap-1 min-w-[60px]" onPress={() => router.push('/(auth)/sign-up')}>
          <UserPlus size={22} className="text-foreground" />
          <Text className="text-[10px] font-medium text-foreground">Sign Up</Text>
        </Pressable>

        <Pressable className="flex-col items-center gap-1 min-w-[60px]" onPress={() => router.push('/(auth)/sign-in')}>
          <LogIn size={22} className="text-foreground" />
          <Text className="text-[10px] font-medium text-foreground">Sign In</Text>
        </Pressable>

        <Pressable className="flex-col items-center gap-1 min-w-[60px]" onPress={() => router.push('/modals/language-select')}>
          <Settings size={22} className="text-foreground" />
          <Text className="text-[10px] font-medium text-foreground">Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}