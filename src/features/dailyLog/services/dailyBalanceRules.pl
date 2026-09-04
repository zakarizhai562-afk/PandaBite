// Daily Balance rules — Tau-Prolog source
// Food facts are asserted at query time from foodDatabase.json

covered_groups(FoodIds, Groups) :-
    findall(G, (member(F, FoodIds), food(F, Gs, _), member(G, Gs)), All),
    sort(All, Groups).

whoa_count(FoodIds, Count) :-
    findall(F, (member(F, FoodIds), food(F, _, whoa)), WhoaFoods),
    length(WhoaFoods, Count).

is_balanced(FoodIds) :-
    covered_groups(FoodIds, Groups),
    subtract([carbs, protein, vitamins], Groups, Missing),
    Missing == [],
    whoa_count(FoodIds, Count),
    Count =< 1.
