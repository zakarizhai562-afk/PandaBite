% dailyBalanceRules.pl
% Group coverage and balance rules for Feature 2: Daily Balance Calculator
% food/3 facts are asserted at query time from foodDatabase.json.

covered_groups(FoodIds, Groups) :-
    findall(G, (member(F, FoodIds), food(F, Gs, _), member(G, Gs)), All),
    sort(All, Groups).

whoa_count(FoodIds, Count) :-
    findall(F, (member(F, FoodIds), food(F, _, whoa)), WhoaFoods),
    length(WhoaFoods, Count).

missing_groups(FoodIds, Missing) :-
    covered_groups(FoodIds, Groups),
    subtract([carbs, protein, vitamins], Groups, Missing).

is_balanced(FoodIds) :-
    missing_groups(FoodIds, []),
    whoa_count(FoodIds, Count),
    Count =< 1.
