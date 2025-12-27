#include <bits/stdc++.h>

#ifndef ONLINE_JUDGE
// #include "debug.h"
#else
#define debug(...)
#define dbg(...)
#endif

// #include <ext/pb_ds/assoc_container.hpp>
// #include <ext/pb_ds/tree_policy.hpp>
// using namespace __gnu_pbds;
using namespace std;
#define int long long
#define pii pair<int,int>
#define pi3 pair<int,pair<int,int>>
#define yah cout<<"YES"<<endl;
#define nah cout<<"NO"<<endl;

#define palice cout<<"Alice"<<endl;
#define pbob cout<<"Bob"<<endl;
#define pz cout<<0<<endl;
#define po cout<<1<<endl;
#define pm cout<<-1<<endl;
#define rall(vc) vc.rbegin(), vc.rend()
#define all(vc) vc.begin(), vc.end()
// template<class T> using ordered_set =tree<T, null_type, less<T>, rb_tree_tag,tree_order_statistics_node_update>;
// template<class T> using ordered_multiset = tree<T, null_type, less_equal<T>, rb_tree_tag, tree_order_statistics_node_update>;

// order_of_key(k): Gives the count of elements smaller than k. — O(log n)
// find_by_order(k): Returns the iterator for the kth element (use k = 0 for the first element). — O(log n)


//*---------------------- Constants ------------------------------------------

const int MOD1 = 1e9 +7;
const int MOD2 = 998244353;
int pinf =  (long long)(1e18) + 10LL;
int ninf = -pinf;


//*---------------------- Sieve ----------------------------------------------
// it precomputes prime numbers <= 6e6 using a sieve. -> N log(logNz)

const int Nz = 6000000;
vector<bool> is_prime(Nz + 1, true);
vector<int> primes;

void precompute_primes() {
    for (int i = 2; i <= Nz; i++) {
        if (is_prime[i]) {
            primes.push_back(i);
            if (1LL * i * i <= Nz) {
                for (int j = i * i; j <= Nz; j += i) {
                    is_prime[j] = false;
                }
            }
        }
    }
}


//*---------------------- BITWISE Funtions ------------------------------------

int binExp(int a, int b) {
    int ans = 1;
    while (b) {
        if (b & 1) {
            ans = (ans * 1LL * a);
        }
        a = (a * 1LL * a);
        b >>= 1;
    }
    return ans;
}

int ple(int n) {
    int c = n;
    int count = 0;
    while (c > 1) {
        c >>= 1;
        count++;
    }
    return count;
}

bool pcheck(int n) {
    if (n <= 0) return false;
    return (n & (n - 1)) == 0;
}


//*--------------------------------------------------------------------------


void solve() {
    
}

//*--------------------------------------------------------------------------


int32_t main() {
    ios_base::sync_with_stdio(false);cin.tie(NULL);

    int T = 1;
    cin >> T;
    while (T--) solve();

    return 0;
}